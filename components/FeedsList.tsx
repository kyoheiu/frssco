import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, Site } from "../types/types.ts";
import xmlEntities from "https://deno.land/x/html_entities@v1.0/lib/xml-entities.js";

export const FeedsList = (props: { data: Entry[] }) => {
  const sites: Map<string, string> = new Map();
  props.data.forEach((entry: Entry) => {
    sites.set(entry.sitetitle, entry.siteurl);
  });

  return (
    <>
      <div className="side-list">
        <form>
          <input type="url" placeholder="Add feed" />
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
};
