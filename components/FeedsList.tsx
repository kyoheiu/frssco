import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { Entry, Site } from "../types/types.ts";

export const FeedsList = (props: { data: Entry[] }) => {
  const list: Site[] = [
    ...new Set(props.data.map((x: Entry) => {
      return { sitetitle: x.sitetitle, siteurl: x.siteurl };
    })),
  ];

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
      {list.map((x: Site) => {
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
