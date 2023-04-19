import { Handlers, PageProps } from "$fresh/server.ts";
import { Entry, FeedsState } from "../types/types.ts";
import FeedsList from "../components/FeedsList.tsx";
import { Contents } from "../components/Contents.tsx";
import Header from "../islands/Header.tsx";
import { Database } from "https://deno.land/x/sqlite3@0.9.1/mod.ts";
import Menu from "../islands/Menu.tsx";
import { getCookies } from "std/http/cookie.ts";
import IconLogin from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/login.tsx";

const compareUpdated = (a: Entry, b: Entry): number => {
  if (b.date > a.date) {
    return 1;
  } else {
    return -1;
  }
};

const Login = () => {
  return (
    <div className="login-form">
      <form method="post" action="/api/login">
        <input type="text" name="username" placeholder="USERNAME" />
        <input type="password" name="password" placeholder="PASSWORD" />
        <p>
          <button type="submit">
            <IconLogin />
          </button>
        </p>
      </form>
    </div>
  );
};

export const handler: Handlers<FeedsState> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "frssco_logged_in") {
      return ctx.render!({ feeds: [], loggedIn: false });
    }
    const url = new URL(req.url);
    const q = url.searchParams.get("url");

    try {
      await Deno.lstat("test.db");
    } catch (_err) {
      return ctx.render({ feeds: [], loggedIn: true });
    }
    const db = new Database("test.db");
    const stored = db.prepare("SELECT * FROM feeds").all<
      Record<string, Entry>
    >();

    const result: Entry[] = [];

    stored.forEach((x) => result.push(x as unknown as Entry));

    db.close();

    result.sort(compareUpdated);

    if (q) {
      return ctx.render({ feeds: result, filtered: q, loggedIn: true });
    } else {
      return ctx.render({ feeds: result, loggedIn: true });
    }
  },
};

export default function Top({ data }: PageProps<FeedsState | null>) {
  if (!data || !data.loggedIn) {
    return <Login />;
  } else {
    return (
      <>
        <Header />
        <Menu data={data} />
        <div className="wrapper">
          <aside className="side-list">
            <FeedsList data={data} />
          </aside>
          <main>
            <Contents data={data} />
          </main>
        </div>
      </>
    );
  }
}
