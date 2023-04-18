export interface FeedsState {
  feeds: Entry[];
  filtered?: string;
  loggedIn: boolean;
}

export interface ParsedDescription {
  cover: string | null;
  text: string;
}

export interface Entry {
  sitetitle: string;
  siteurl: string;
  title: string;
  link: string;
  date: Date;
  cover: string | null;
  text: string;
}

export interface Site {
  sitetitle: string;
  siteurl: string;
}

export enum Feedback {
  Init,
  Loading,
  Error,
}
