import { Entry, FeedsState } from "../types/types.ts";
import { since } from "https://deno.land/x/tims@1.0.0/mod.ts";
import CustomShare from "../islands/CustomShare.tsx";
import CopyLink from "../islands/CopyLink.tsx";

export const Contents = (props: { data: FeedsState }) => {
  let list = props.data.feeds;
  if (props.data.filtered) {
    list = list.filter((x: Entry) => (x.siteurl === props.data.filtered));
  }

  const sinceCreated = (date: Date): string => {
    return since(Date.parse(date.toString())).split(",")[0];
  };

  const toUIntArray = (s: string): string => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(s);
    return encoded.toString();
  };

  return (
    <>
      <div className="main-list">
        {list.map((x: Entry) => {
          return (
            <>
              <div className="entry-block">
                <div className="entry-title">
                  <a href={x.link} target="blank" rel="noopner noreferrer">
                    {x.title}
                  </a>
                </div>
                <div className="entry-info">
                  <div>
                    {x.sitetitle}
                  </div>
                  <div>
                    &nbsp; &nbsp;
                  </div>
                  <div className="entry-updated">
                    {sinceCreated(x.date)}
                  </div>
                </div>
                <hr className="entry-divider" />
                <div className="entry-description">
                  <div className="entry-thumbnail">
                    <img
                      src={x.cover ? x.cover : "/alt.png"}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "/alt.png";
                      }}
                    />
                  </div>
                  <div className="entry-text">
                    {x.text}
                  </div>
                </div>
                <div className="entry-buttons">
                  <CopyLink url={x.link} />
                  &nbsp;
                  <CustomShare target={x.link} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};
