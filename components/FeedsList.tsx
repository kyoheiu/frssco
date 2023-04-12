import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, FeedsState } from "../types/types.ts";

export const FeedsList = (props: { data: Entry[] }) => {
  const list = props.data;

  return (
    <>
      <form>
        <input type="url" placeholder="Add feed" />
      </form>
      <div>
        <a href="/">
          ALL
        </a>
      </div>
      {list.map((x: Entry) => {
        const target = `/?url=${x.siteurl ?? ""}`;

        return (
          <div>
            <a href={target}>
              {x.sitetitle}
            </a>
          </div>
        );
      })}
    </>
  );
};
