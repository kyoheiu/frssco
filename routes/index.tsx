import { Handlers, PageProps } from "$fresh/server.ts";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedsState } from "../types/types.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";
import { FeedsList } from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";

export const handler: Handlers<FeedsState> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const q = url.searchParams.get("url");

    const text = await Deno.readTextFile("feed.txt");
    const feedList = text.split(/\r?\n/g).filter((x: string) =>
      !x.startsWith("#")
    );
    const resList = await Promise.allSettled(feedList.map((x) => {
      return fetch(x);
    }));
    const bodyList = await Promise.all(
      resList.map(async (x: PromiseSettledResult<Response>) => {
        if (x.status === "fulfilled") {
          return await x.value.text();
        }
      }),
    );
    const parsedList = await Promise.allSettled(
      bodyList.map(async (x: string | undefined) => {
        if (x) {
          return await parseFeed(x);
        }
      }),
    );

    let result =
      (parsedList.filter((x) =>
        x.status === "fulfilled"
      ) as PromiseFulfilledResult<rss.Feed>[]).map((x) => x.value);

    if (q) {
      result = result.filter((x: rss.Feed) => x.id === q);
      return ctx.render({ feeds: result, filtered: true });
    }

    console.log(result);
    return ctx.render({ feeds: result, filtered: false });
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
