import { Handlers } from "$fresh/server.ts";
import { setCookie } from "std/http/cookie.ts";
import "std/dotenv/load.ts";

export const handler: Handlers = {
  async POST(req) {
    const url = new URL(req.url);
    const form = await req.formData();
    const headers = new Headers();

    if (
      form.get("username") === Deno.env.get("USERNAME") &&
      form.get("password") === Deno.env.get("PASSWORD")
    ) {
      setCookie(headers, {
        name: "auth",
        value: "bar",
        maxAge: 120,
        sameSite: "Lax",
        domain: url.hostname,
        path: "/",
        secure: true,
      });
    }

    headers.set("location", "/");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};
