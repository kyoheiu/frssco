import { Entry, FeedsState } from "../types/types.ts";

export default function FeedsList(props: { data: FeedsState }) {
  const sites: Map<string, string> = new Map();
  props.data.feeds.forEach((entry: Entry) => {
    sites.set(entry.sitetitle, entry.siteurl);
  });

  return (
    <>
      <div className="side-list">
        <div>
          <a href="/edit">
            * Edit source
          </a>
        </div>
        <div>
          <a href="/">
            * ALL
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
