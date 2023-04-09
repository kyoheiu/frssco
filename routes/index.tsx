import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedList } from "../types/typs.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";
import { FeedsList } from "../components/feedsList.tsx";
import { Contents } from "../components/Contents.tsx";

export const handler: Handlers<rss.Feed[]> = {
  async GET(_, ctx) {
    const feedList = await Deno.readTextFile("feed.json");
    const list: FeedList = JSON.parse(feedList);
    const resultList = await Promise.all(list.feeds.map(x => { return fetch(x); }));
    const result = await Promise.all(resultList.map(async (x: Response) => { return await x.text() }));
    const parsed = await Promise.all(result.map(async (x: string) => await parseFeed(x)));

    console.log(JSON.stringify(parsed.map(x => x.entries).flat().map(x => x.description!.value)));

    return ctx.render(parsed);
  }
}

export default function Top({ data }: PageProps<rss.Feed[] | null>) {
  if (!data) {
    return <h1>Feeds not found.</h1>;
  } else {
    return (<div className="wrapper"><aside>
      <FeedsList originalList={data} />
    </aside>
      <main>
        <Contents originalList={data} />
      </main>
    </div>);
  }
}
