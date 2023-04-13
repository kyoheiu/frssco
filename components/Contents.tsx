import { Entry } from "../types/types.ts";
import { between, since } from "https://deno.land/x/tims@1.0.0/mod.ts";
import CustomShare from "../islands/CustomShare.tsx";
import CopyLink from "../islands/CopyLink.tsx";

export const Contents = (props: { originalList: Entry[] }) => {
  const list = props.originalList;

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
        {list.slice(0, 20).map((x: Entry) => {
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
                    {sinceCreated(x.date)}
                  </div>
                </div>
                <hr className="entry-divider" />
                <div className="entry-description">
                  <div className="entry-thumbnail">
                    <img
                      className="thumbnail"
                      src={x.cover
                        ? x.cover
                        : `https://picsum.photos/seed/${
                          toUIntArray(x.title)
                        }/200/100`}
                    />
                  </div>
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
