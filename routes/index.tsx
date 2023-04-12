import { Handlers, PageProps } from "$fresh/server.ts";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, FeedsState } from "../types/types.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";
import { FeedsList } from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";
import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";

const compareUpdated = (a: Entry, b: Entry): number => {
  const elementA = a.updated;
  const elementB = b.updated;

  if (elementA > elementB) {
    return -1;
  } else if (elementB > elementA) {
    return 1;
  } else {
    return 0;
  }
};

export const handler: Handlers<Entry[]> = {
  async GET(req, ctx) {
    // const url = new URL(req.url);
    // const q = url.searchParams.get("url");

    const db = new Database("test.db");
    const stored = db.prepare("SELECT * FROM feeds").all<
      Record<string, Entry>
    >();

    let result: Entry[] = [];

    stored.forEach((x) => result.push(x as Entry));

    db.close();

    // if (q) {
    //   result = result.filter((x: rss.Feed) => x.id === q);
    //   return ctx.render({ feeds: result, filtered: true });
    // }

    result = result.filter((x) => x.updated <= (Date.now() / 1000));
    result.sort(compareUpdated);
    console.log(result[0]);

    return ctx.render(result);
  },
};

export default function Top({ data }: PageProps<Entry[] | null>) {
  if (!data) {
    return <h1>Feeds not found.</h1>;
  } else {
    return (
      <>
        {/* <Header data={data} /> */}
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
