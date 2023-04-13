import { Handlers, PageProps } from "$fresh/server.ts";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, FeedsState } from "../types/types.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";
import { FeedsList } from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";
import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";

const compareUpdated = (a: Entry, b: Entry): number => {
  if (b.date > a.date) {
    return 1;
  } else {
    return -1;
  }
};

export const handler: Handlers<Entry[]> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const q = url.searchParams.get("url");

    const db = new Database("test.db");
    const stored = db.prepare("SELECT * FROM feeds").all<
      Record<string, Entry>
    >();

    let result: Entry[] = [];

    stored.forEach((x) => result.push(x as unknown as Entry));

    db.close();

    if (q) {
      result = result.filter((x: Entry) => x.siteurl === q);
      return ctx.render(result);
    }

    result.sort(compareUpdated);

    return ctx.render(result);
  },
};

export default function Top({ data }: PageProps<Entry[] | null>) {
  if (!data) {
    return <h1>Feeds not found.</h1>;
  } else {
    return (
      <>
        <Header data={data} />
        <div className="wrapper">
          <aside className="side-list">
            <FeedsList data={data} />
          </aside>
          <main>
            <Contents originalList={data} />
          </main>
        </div>
      </>
    );
  }
}
