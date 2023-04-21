import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/src/server/types.ts";

export default function App({ Component }: AppProps) {
  return (
    <html data-custom="data">
      <Head>
        <title>frssco</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="globals.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" />
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
