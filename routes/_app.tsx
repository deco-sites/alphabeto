import { asset, Head } from "$fresh/runtime.ts";
import { defineApp } from "$fresh/server.ts";
import { Context } from "@deco/deco";
import { useScript } from "@deco/deco/hooks";
const serviceWorkerScript = () =>
  addEventListener(
    "load",
    () =>
      navigator &&
      navigator.serviceWorker &&
      navigator.serviceWorker.register("/sw.js"),
  );
export default defineApp(async (_req, ctx) => {
  const revision = await Context.active().release?.revision();
  return (
    <html lang="pt-br">
      {/* Include Icons and manifest */}
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        {/* Enable View Transitions API */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@view-transition { navigation: auto; }`,
          }}
        />

        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: useScript(() => {
              function setDynamicHeight() {
                document.documentElement.style.setProperty(
                  "--vh",
                  `${window.innerHeight / 100}px`,
                );
              }
              setDynamicHeight();
              globalThis.addEventListener("resize", setDynamicHeight);
              globalThis.addEventListener(
                "orientationchange",
                setDynamicHeight,
              );
            }),
          }}
        />

        {/* Tailwind v3 CSS file */}
        <link
          href={asset(`/styles.css?revision=${revision}`)}
          rel="stylesheet"
        />

        {/* Web Manifest */}
        <link rel="manifest" href={asset("/site.webmanifest")} />

        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
              font-family: "BeccaPerry";
              src: url(${asset("/fonts/BeccaPerry.ttf")}) format('truetype');
              font-weight: 500;
              font-display: swap;
              font-style: normal;
            }

            @font-face {
              font-family: "Quicksand";
              src: url(${
              asset("/fonts/Quicksand-Regular.ttf")
            }) format('truetype');
              font-weight: 400;
              font-display: swap;
              font-style: normal;
            }

            @font-face {
              font-family: "Quicksand";
              src: url(${
              asset("/fonts/Quicksand-Medium.ttf")
            }) format('truetype');
              font-weight: 500;
              font-display: swap;
              font-style: normal;
            }

            @font-face {
              font-family: "Quicksand";
              src: url(${
              asset("/fonts/Quicksand-SemiBold.ttf")
            }) format('truetype');
              font-weight: 600;
              font-display: swap;
              font-style: normal;
            }

            @font-face {
              font-family: "Quicksand";
              src: url(${
              asset("/fonts/Quicksand-Bold.ttf")
            }) format('truetype');
              font-weight: 700;
              font-display: swap;
              font-style: normal;
            }
            `,
          }}
        />
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js"
        >
        </script>
      </Head>

      {/* Rest of Preact tree */}
      <ctx.Component />

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(serviceWorkerScript) }}
      />
    </html>
  );
});
