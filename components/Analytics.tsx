import { sendEvent } from "site/sdk/analytics.ts";
import type { AnalyticsEvent } from "apps/commerce/types.ts";
import type ExtendedAnalyticsEvent from "site/components/analytics.d.ts";

const SendEventOnClick = <E extends ExtendedAnalyticsEvent>(
  { event, id }: { event: E; id: string },
) => (
  <script
    type="module"
    dangerouslySetInnerHTML={{
      __html:
        `addEventListener("load", () => {const element = document.getElementById("${id}"); element && element.addEventListener("click", () => (${sendEvent})(${
          JSON.stringify(event)
        }));})`,
    }}
  />
);

const SendEventOnLoad = <E extends AnalyticsEvent>({ event }: { event: E }) => (
  <script
    type="module"
    dangerouslySetInnerHTML={{
      __html: `addEventListener("load", () => (${sendEvent})(${
        JSON.stringify(event)
      }))`,
    }}
  />
);

export { SendEventOnClick, SendEventOnLoad };
