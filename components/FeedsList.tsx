import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedsState } from "../types/types.ts";

const compareUpdated = (a: Feed, b: Feed): number => {
  const elementA = a.updateDate ?? "0";
  const elementB = b.updateDate ?? "0";

  if (elementA > elementB) {
    return -1;
  } else if (elementB > elementA) {
    return 1;
  } else {
    return 0;
  }
};

export const FeedsList = (props: { data: FeedsState }) => {
  const feedsList = props.data.feeds.sort(compareUpdated);

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
      {feedsList.map((x: Feed) => {
        const target = `/?url=${x.id}`;

        return (
          <div>
            <a href={target}>
              {props.data.filtered && <span>&#x25B8; &nbsp;</span>}
              {x.title.value}
            </a>
          </div>
        );
      })}
    </>
  );
};
