import { Handlers } from "https://deno.land/x/fresh@1.1.5/server.ts";

export const handler: Handlers = {
  GET(req, _ctx) {
    const url = new URL(req.url);
    const query = url.searchParams.get("url") || "";
    console.log(query);
    try {
      Deno.writeTextFileSync("feed.txt", `\n${query}`, { append: true });
      return Response.redirect(url.origin);
    } catch (e) {
      return new Response(e, {
        status: 500,
      });
    }
  },
};
