import * as rss from "https://deno.land/x/rss@0.5.8/mod.ts";

export interface FeedsState {
    feeds: rss.Feed[],
    filtered: boolean
}

export interface ParsedDescription {
    cover: string,
    text: string
}

export interface Entry {
    sitetitle: string,
    siteurl: string,
    title: string,
    link: string,
    date: Date,
    cover: string,
    text: string
}

export interface Site {
    sitetitle: string,
    siteurl: string
}