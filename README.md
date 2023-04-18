# frssco

A dead-simple self-hostable RSS aggregator written in Deno.

![ss1.png](/screenshots/ss1.png)

## Deploy

1. `git clone` this repo.

2. Add `/feed.txt`, `/.env` and `./islands/CustomShare.tsx`.

```
# feed.txt (Lines prefixed with # are ignored)
https://news.itsfoss.com/latest/rss/
...
```

```
USERNAME=user_name
PASSWORD=password
```

```ts
// Customshare.tsx

import IconSend from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/send.tsx";

export default function CustomShare(props: { target: string }) {
  const send = async () => {
    const res = await fetch("https://example.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "YOUR_TOKEN",
      },
      body: JSON.stringify({ url: props.target }),
    });
    console.log(res.status);
  };

  return (
    <>
      <button onClick={send}>
        <IconSend />
      </button>
    </>
  );
}
```

3.

```
sudo docker run -it -v ./feed.txt:/app/feed.txt -p 8080:8080 $(sudo docker build -q .)
curl -X POST http://localhost:8080/api/refresh # needed to update feed list
```

The app will start listening on port 8080.
