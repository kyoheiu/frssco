import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import { HandlerContext } from "$fresh/server.ts";
import { Feed, parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, ParsedDescription } from "../../types/types.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/feed.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const CREATE = "CREATE TABLE feeds (id integer not null, sitetitle TEXT not null, siteurl TEXT not null, title TEXT not null, link TEXT not null, updated INTEGER not null, cover TEXT not null, text TEXT not null)";

const asContentElement = (feed: Feed): Entry[] => {
  return feed.entries.filter((x: FeedEntry) =>
    x.updated && Date.now() - x.updated.getTime() > 0
  ).map((x: FeedEntry) => {
    const desc = parseDescription(
      x.description ? x.description.value : undefined,
    );
    const updated = x.updated ? x.updated.getTime() : 0;

    const link = x.id ? (x.id.startsWith("http") ? x.id : x.links[0].href as string) : "";

    return {
      sitetitle: feed.title.value ?? "",
      siteurl: feed.id,
      title: x.title ? x.title.value ?? "" : "",
      link: link,
      updated: updated,
      cover: desc.cover,
      text: desc.text ?? "",
    };
  });
};

const parseDescription = (html: string | undefined): ParsedDescription => {
  if (!html) {
    return {cover: "", text: ""};
  }
  const document = new DOMParser().parseFromString(
    html,
    "text/html",
  );
  const cover = document?.querySelector("img")?.getAttribute("src") ?? "";
  const a = document?.querySelector("a");
  a?.remove();
  const text = document ? document.textContent : "";
  return { cover: cover, text: text };
};

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    try {
      await Deno.remove("test.db");
    } catch (_err) {
      console.error("Db does not exist yet.");
    }
    const db = new Database("test.db");
    db.exec(CREATE);

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
    const result =
      (parsedList.filter((x) =>
        x.status === "fulfilled"
      ) as PromiseFulfilledResult<Feed>[]).map((x) => x.value);

    const entryList = result.map((x: Feed) => {return asContentElement(x)}).flat();

    for (let i = 1; i < entryList.length; i++) {
      const e =entryList[i];
        if (!e) {
          continue;
        } else {
          db.exec("INSERT INTO feeds (id, sitetitle, siteurl, title, link, updated, cover, text) values(?, ?, ?, ?, ?, ?, ?, ?)", i, e.sitetitle, e.siteurl, e.title, e.link, e.updated, e.cover, e.text);
        }
    }

    db.close();
    console.log("Stored list to database.");

    return new Response("OK", {
      status: 200
    });
};
