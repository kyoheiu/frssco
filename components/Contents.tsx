import { Feed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import { FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/mod.ts";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { ContentElement, ParsedDescription } from "../types/typs.ts";

const asContentElement = (feed: Feed): ContentElement[] => {
    const site = feed.title.value;
    return feed.entries.map((x: FeedEntry) => {
        const desc = parseDescription(x.description!.value);

        return {
            feed: site!,
            title: x.title?.value,
            updated: x.updated,
            link: x.id!,
            cover: desc.cover,
            text: desc.text
        };
    });
}

const compareUpdated = (a: ContentElement, b: ContentElement): number => {
    const elementA = a.updated ?? "0";
    const elementB = b.updated ?? "0";

    if (elementA > elementB) {
        return -1;
    } else if (elementB > elementA) {
        return 1;
    } else {
        return 0
    };
}

const parseDescription = (html: string | undefined): ParsedDescription => {
    const document = new DOMParser().parseFromString(html!, "text/html");
    const cover = document?.querySelector("img")?.getAttribute("src");
    const a = document?.querySelector("a");
    a?.remove();
    const text = document?.textContent;
    return { cover: cover, text: text };
}

export const Contents = (props: { originalList: Feed[] }) => {
    const entries: ContentElement[] = props.originalList.map((x: Feed) => { return asContentElement(x); }).flat();
    entries.sort(compareUpdated);

    const [list, setList] = useState(entries);

    return (<>
        <div>
            <ul>
                {list.map((x: ContentElement) => {
                    return (<><li><a href={x.link} target="blank" rel="noopner noreferrer">{x.title}</a><div className="description"><img className="thumbnail" src={x.cover} />{x.text}</div></li></>);
                })}
            </ul >
        </div >
    </>);
}
