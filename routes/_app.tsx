import { asset, Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App({ Component }: AppProps) {
    return (
        <html data-custom="data">
            <Head>
                <title>rssless</title>
                <link rel="stylesheet" href="global.css" />
            </Head>
            <body>
                <Component />
            </body>
        </html>
    );
}