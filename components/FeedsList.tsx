import { Entry } from "../types/types.ts";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";

export default function FeedsList(props: { data: Entry[] }) {
  const sites: Map<string, string> = new Map();
  props.data.forEach((entry: Entry) => {
    sites.set(entry.sitetitle, entry.siteurl);
  });

  return (
    <>
      <div className="side-list">
        <form action="/api/append">
          <input
            type="url"
            name="url"
            placeholder="Add feed"
          />
        </form>
        <div>
          <a href="/">
            ALL
          </a>
        </div>
        {[...sites].map((kv) => {
          const target = `/?url=${kv[1] ?? ""}`;

          return (
            <div className="feed-title">
              <a href={target}>
                {kv[0]}
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
