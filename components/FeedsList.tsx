import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";

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

export const FeedsList = (props: { originalList: Feed[] }) => {
  const feedsList = props.originalList.sort(compareUpdated);
  const [list, setList] = useState(feedsList);
  const [query, setQuery] = useState("");

  return (
    <>
      <div className="side-list">
        {list.map((x: Feed) => {
          return (
            <div>
              <a href={x.id} target="blank" rel="noopner noreferrer">
                {x.title.value}
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};
