import { Handlers, PageProps } from "$fresh/server.ts";
import { Entry, FeedsState } from "../types/types.ts";
import FeedsList from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";
import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import Menu from "../islands/Menu.tsx";

const compareUpdated = (a: Entry, b: Entry): number => {
  if (b.date > a.date) {
    return 1;
  } else {
    return -1;
  }
};

export const handler: Handlers<FeedsState> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const q = url.searchParams.get("url");

    const db = new Database("test.db");
    const stored = db.prepare("SELECT * FROM feeds").all<
      Record<string, Entry>
    >();

    const result: Entry[] = [];

    stored.forEach((x) => result.push(x as unknown as Entry));

    db.close();

    result.sort(compareUpdated);

    if (q) {
      return ctx.render({ feeds: result, filtered: q });
    } else {
      return ctx.render({ feeds: result });
    }
  },
};

export default function Top({ data }: PageProps<FeedsState | null>) {
  if (!data) {
    return <h1>Feeds not found.</h1>;
  } else {
    return (
      <>
        <Header />
        <Menu data={data} />
        <div className="wrapper">
          <aside className="side-list">
            <FeedsList data={data} />
          </aside>
          <main>
            <Contents data={data} />
          </main>
        </div>
      </>
    );
  }
}
