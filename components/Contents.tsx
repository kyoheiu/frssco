import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/mod.ts";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { Entry, ParsedDescription } from "../types/types.ts";
import { between } from "https://deno.land/x/tims@1.0.0/mod.ts";
import CustomShare from "../islands/CustomShare.tsx";
import CopyLink from "../islands/CopyLink.tsx";

export const Contents = (props: { originalList: Entry[] }) => {
  const list = props.originalList;

  const diff = (now: number, updated: number): string => {
    return between(now, updated).split(",")[0];
  };

  return (
    <>
      <div className="main-list">
        {list.slice(0, 9).map((x: Entry) => {
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
                    {x.sitetitle}
                  </div>
                  <div>
                    &nbsp; &nbsp;
                  </div>
                  <div>
                    {diff(Date.now(), x.updated)}
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
