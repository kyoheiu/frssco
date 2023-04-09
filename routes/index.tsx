import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedList, FeedsState } from "../types/types.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";
import { FeedsList } from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";

export const handler: Handlers<FeedsState> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const q = url.searchParams.get("url");

    const feedList = await Deno.readTextFile("feed.json");
    const list: FeedList = JSON.parse(feedList);
    const resultList = await Promise.all(list.feeds.map((x) => {
      return fetch(x);
    }));
    const result = await Promise.all(resultList.map(async (x: Response) => {
      return await x.text();
    }));
    let parsed = await Promise.all(
      result.map(async (x: string) => await parseFeed(x)),
    );

    if (q) {
      parsed = parsed.filter((x: rss.Feed) => x.id === q);
      return ctx.render({ feeds: parsed, filtered: true });
    }

    console.log(parsed);
    return ctx.render({ feeds: parsed, filtered: false });
  },
};

export default function Top({ data }: PageProps<FeedsState | null>) {
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
            <Contents originalList={data.feeds} />
          </main>
        </div>
      </>
    );
  }
}
