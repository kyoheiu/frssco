import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/mod.ts";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Entry, ParsedDescription } from "../types/types.ts";
import { between } from "https://deno.land/x/tims@1.0.0/mod.ts";
import CustomShare from "../islands/CustomShare.tsx";
import CopyLink from "../islands/CopyLink.tsx";

const asContentElement = (feed: Feed): Entry[] => {
  const site = feed.title.value;
  return feed.entries.map((x: FeedEntry) => {
    const desc = parseDescription(x.description!.value);

    return {
      feed: site!,
      title: x.title?.value,
      updated: x.updated,
      link: x.id!,
      cover: desc.cover,
      text: desc.text,
    };
  });
};

const compareUpdated = (a: Entry, b: Entry): number => {
  const elementA = a.updated ?? "0";
  const elementB = b.updated ?? "0";

  if (elementA > elementB) {
    return -1;
  } else if (elementB > elementA) {
    return 1;
  } else {
    return 0;
  }
};

const parseDescription = (html: string | undefined): ParsedDescription => {
  const document = new DOMParser().parseFromString(html!, "text/html");
  const cover = document?.querySelector("img")?.getAttribute("src");
  const a = document?.querySelector("a");
  a?.remove();
  const text = document?.textContent;
  return { cover: cover, text: text };
};

export const Contents = (props: { originalList: Feed[] }) => {
  const entries: Entry[] = props.originalList.map((x: Feed) => {
    return asContentElement(x);
  }).flat();
  entries.sort(compareUpdated);

  const [list, setList] = useState(entries);

  const diff = (now: number, updated: Date): string => {
    return between(now, updated).split(",")[0];
  };

  return (
    <>
      <div className="main-list">
        {list.map((x: Entry) => {
          return (
            <>
              <div className="entry-block">
                <div className="entry-wrapper">
                  <div className="entry-title">
                    <a href={x.link} target="blank" rel="noopner noreferrer">
                      {x.title}
                    </a>
                  </div>
                  <div className="entry-buttons">
                    <div>
                      <CopyLink url={x.link} />
                    </div>
                    <div>
                      <CustomShare target={x.link} />
                    </div>
                  </div>
                </div>
                <div className="entry-info">
                  <div>
                    {x.feed}
                  </div>
                  <div>
                    &nbsp; &nbsp;
                  </div>
                  <div>
                    {diff(Date.now(), x.updated!)}
                  </div>
                </div>
                <hr className="entry-divider" />
                <div className="entry-description">
                  <img className="entry-thumbnail" src={x.cover} />
                  <div className="entry-text">
                    {x.text}
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};
