import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";

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

  return (
    <>
      {feedsList.map((x: Feed) => {
        return (
          <div>
            <a href={x.id} target="blank" rel="noopner noreferrer">
              {x.title.value}
            </a>
          </div>
        );
      })}
    </>
  );
};
