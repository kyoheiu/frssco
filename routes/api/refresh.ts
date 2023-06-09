import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import { Feed, parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, ParsedDescription } from "../../types/types.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/feed.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js";
import { Handlers } from "https://deno.land/x/fresh@1.1.5/server.ts";

const CREATE =
  "CREATE TABLE feeds (id integer not null, sitetitle TEXT not null, siteurl TEXT not null, title TEXT not null, link TEXT not null, date TEXT not null, cover TEXT, text TEXT not null)";

const asContentElement = (feed: Feed): Entry[] => {
  if (feed && Object.hasOwn(feed, "entries")) {
    return feed.entries.map((x: FeedEntry) => {
      const updated = x.published
        ? x.published
        : (x.updated ? x.updated : new Date("1900"));
      const desc = parseDescription(x);

      const link = x.id
        ? (x.id.startsWith("http") ? x.id : x.links[0].href as string)
        : "";

      return {
        sitetitle: feed.title.value ?? "",
        siteurl: feed.id,
        title: x.title ? x.title.value ?? "" : "",
        link: link,
        date: updated,
        cover: desc.cover,
        text: desc.text,
      };
    });
  } else {
    return [];
  }
};

const parseDescription = (entry: FeedEntry): ParsedDescription => {
  const desc = Html5Entities.decode(entry.description?.value ?? "");
  const content = entry.content?.value;

  if (!desc) {
    return { cover: "", text: "" };
  }
  const document = new DOMParser().parseFromString(
    desc,
    "text/html",
  );

  if (!document) {
    return { cover: "", text: "" };
  }

  let cover: string | null =
    document.querySelector("img")?.getAttribute("src") ?? "";
  if (cover === "") {
    const content_document = new DOMParser().parseFromString(
      content ?? "",
      "text/html",
    );
    if (content_document) {
      cover = content_document.querySelector("img")?.getAttribute("src") ??
        null;
    }
  }
  const text = document.textContent;
  return { cover: cover, text: text };
};

export const handler: Handlers = {
  async POST(_req, _ctx) {
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

    const entryList = result.map((x: Feed) => {
      return asContentElement(x);
    }).flat().filter((x: Entry) => !(x.date > new Date()));

    for (let i = 1; i < entryList.length; i++) {
      const e = entryList[i];
      if (!e) {
        continue;
      } else {
        db.exec(
          "INSERT INTO feeds (id, sitetitle, siteurl, title, link, date, cover, text) values(?, ?, ?, ?, ?, ?, ?, ?)",
          i,
          e.sitetitle,
          e.siteurl,
          e.title,
          e.link,
          e.date,
          e.cover,
          e.text,
        );
      }
    }

    db.close();
    console.log("Stored list to database.");

    return new Response("OK", {
      status: 200,
    });
  },
};
