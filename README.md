# frssco

A self-hostable RSS aggregator.

## Deploy

1. Add `./islands/CustomShare.tsx` to make your own sharing work.

```ts
// example

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

2.

```
git clone https://github.com/kyoheiu/frssco
sudo docker run -it -v ./feed.txt:/app/feed.txt -p 8080:8080 $(sudo docker build -q .)
curl -X POST http://localhost:8080/api/refresh # needed to update feed list
```

And the app will start listening on port 8080.

## Dev

1. Add `./islands/CustomShare.tsx`.

2.

```
git clone https://github.com/kyoheiu/frssco
deno task start
```

And the app will start listening on port 8080.
