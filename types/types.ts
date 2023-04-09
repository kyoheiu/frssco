import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";

export interface FeedsState {
    feeds: rss.Feed[],
    filtered: boolean
}

export interface FeedList {
    feeds: string[]
}

export interface ParsedDescription {
    cover: string | null | undefined,
    text: string | undefined
}

export interface Entry {
    feed: string,
    title: string | undefined,
    updated: Date | undefined,
    link: string,
    cover: string | null | undefined,
    text: string | undefined
}