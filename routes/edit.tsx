import { Handlers, PageProps } from "$fresh/server.ts";
import { EditState, Entry } from "../types/types.ts";
import Header from "../islands/Header.tsx";
import { getCookies } from "std/http/cookie.ts";
import IconLogin from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/login.tsx";
import IconCheck from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/check.tsx";

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

export const handler: Handlers<EditState> = {
  async GET(req, ctx) {
    const cookies = getCookies(req.headers);
    if (cookies.auth !== "frssco_logged_in") {
      return ctx.render!({ source: "", loggedIn: false });
    }
    const text = await Deno.readTextFile("feed.txt");
    return ctx.render!({ source: text, loggedIn: true });
  },
};

export default function Top({ data }: PageProps<EditState | null>) {
  if (!data || !data.loggedIn) {
    return <Login />;
  }
  return (
    <>
      <Header />
      <div className="edit-textarea-wrapper">
        <p>
          Edit your source here.
          <br />
          To comment out, prefix the line with #.
        </p>
        <form action="/api/edit">
          <textarea name="textarea" className="edit-textarea" rows={40}>
            {data.source}
          </textarea>
          <p>
            <button type="submit" className="edit-button">
              <IconCheck />
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
