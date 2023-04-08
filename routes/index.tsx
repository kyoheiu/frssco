import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedList } from "../types/typs.ts";
import { parseFeed } from "https://deno.land/x/rss@0.5.8/src/deserializer.ts";

export const handler: Handlers<rss.Feed[]> = {
  async GET(_, ctx) {
    const feedList = await Deno.readTextFile("feed.json");
    const list: FeedList = JSON.parse(feedList);
    const resultList = await Promise.all(list.feeds.map(x => { return fetch(x); }));
    const result = await Promise.all(resultList.map(async (x: Response) => { return await x.text() }));
    const parsed = await Promise.all(result.map(async (x: string) => await parseFeed(x)));
    return ctx.render(parsed);
  }
}

export default function Top({ data }: PageProps<rss.Feed[] | null>) {
  if (!data) {
    return <h1>Feeds not found.</h1>;
  } else {
    <div>
      <li>
        {data.map(feed => {
          return (<ul>{feed.title}</ul>);
        })}
      </li>
    </div>
  }
}
