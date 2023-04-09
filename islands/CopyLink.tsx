import IconLink from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/link.tsx";

type urlProp = {
  url: string;
};

const copyToClipboard = async (url: string) => {
  await navigator.clipboard.writeText(url);
};

export default function CopyLink(props: { url: string }) {
  return (
    <>
      <button onClick={() => copyToClipboard(props.url)}>
        <IconLink />
      </button>
    </>
  );
}
