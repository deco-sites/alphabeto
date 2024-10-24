import { useScript } from "@deco/deco/hooks";
import { AppContext } from "../../apps/site.ts";
import { MINICART_FORM_ID } from "../../constants.ts";
import { clx } from "../../sdk/clx.ts";
import { useComponent } from "../../sections/Component.tsx";

import MinicartFooter from "../../islands/MinicartFooter.tsx";
import FreeShippingProgressBar, { FreeShippingSettings } from "./FreeShippingProgressBar.tsx";
import CartItem, { Item } from "./Item.tsx";
import { MinicartEmpty, MinicartEmptyProps } from "./MinicartEmpty.tsx";
export interface Minicart {
  /** Cart from the ecommerce platform */
  platformCart: Record<string, unknown>;
  /** Cart from storefront. This can be changed at your will */
  storefront: {
    items: Item[];
    total: number;
    subtotal: number;
    discounts: number;
    coupon?: string;
    locale: string;
    currency: string;
    enableCoupon?: boolean;
    checkoutHref: string;
  };
}
const onLoad = (formID: string) => {
  const form = document.getElementById(formID) as HTMLFormElement;
  window.STOREFRONT.CART.dispatch(form);
  // view_cart event
  if (typeof IntersectionObserver !== "undefined") {
    new IntersectionObserver((items, observer) => {
      for (const item of items) {
        if (item.isIntersecting && item.target === form) {
          window.DECO.events.dispatch({
            name: "view_cart",
            params: window.STOREFRONT.CART.getCart(),
          });
          observer?.unobserve(item.target);
        }
      }
    }).observe(form);
  }
  // Disable form interactivity while cart is being submitted
  document.body.addEventListener(
    "htmx:before-send", // deno-lint-ignore no-explicit-any
    ({ detail: { elt } }: any) => {
      if (elt !== form) {
        return;
      }
      // Disable addToCart button interactivity
      document.querySelectorAll("div[data-cart-item]").forEach((container) => {
        container?.querySelectorAll("button").forEach((node) => (node.disabled = true));
        container?.querySelectorAll("input").forEach((node) => (node.disabled = true));
      });
    }
  );
};

export interface Props {
  cart: Minicart;
  minicartSettings: MinicartSettings;
}

export const action = async (
  props: {
    minicartSettings: MinicartSettings;
  },
  req: Request,
  ctx: AppContext
): Promise<any> => {
  const cart = req.method === "PATCH" ? await ctx.invoke("site/loaders/minicart.ts") : await ctx.invoke("site/actions/minicart/submit.ts");
  return { cart, minicartSettings: props.minicartSettings };
};

export function ErrorFallback() {
  return (
    <div class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full gap-2">
      <div class="flex flex-col gap-1 p-6 justify-center items-center">
        <span class="font-semibold">Error while updating cart</span>
        <span class="text-sm text-center">Click in the button below to retry or refresh the page</span>
      </div>

      <button class="btn btn-primary" hx-patch={useComponent(import.meta.url)} hx-swap="outerHTML" hx-target="closest div">
        Retry
      </button>
    </div>
  );
}

export interface MinicartSettings {
  minicartEmpty?: MinicartEmptyProps;
  freeShippingBarSettings?: FreeShippingSettings;
}

export default function Cart(props: Props) {
  const {
    cart: {
      platformCart,
      storefront: { items, total, coupon, locale, currency },
    },
    minicartSettings,
  } = props;
  const count = items.length;
  return (
    <>
      <form
        class="contents minicartContent"
        id={MINICART_FORM_ID}
        hx-sync="this:replace"
        hx-trigger="submit, change delay:300ms"
        hx-target="this"
        hx-swap="outerHTML"
        hx-indicator="this"
        hx-disabled-elt="this"
        hx-post={useComponent(import.meta.url, {
          minicartSettings: minicartSettings,
        })}
      >
        {/* Button to submit the form */}
        <button hidden autofocus />

        {/* Add to cart controllers */}
        <input name="add-to-cart" type="hidden" />
        <button hidden name="action" value="add-to-cart" />

        {/* This contains the STOREFRONT cart. */}
        <input type="hidden" name="storefront-cart" value={encodeURIComponent(JSON.stringify({ coupon, currency, value: total, items }))} />

        {/* This contains the platformCart cart from the commerce platform. Integrations usually use this value, like GTM, pixels etc */}
        <input type="hidden" name="platform-cart" value={encodeURIComponent(JSON.stringify(platformCart))} />

        <div class={clx("flex flex-col flex-grow justify-center items-center overflow-hidden w-full", "[.minicartContent.htmx-request_&]:pointer-events-none [.minicartContent.htmx-request_&]:opacity-60 [.minicartContent.htmx-request_&]:cursor-wait transition-opacity duration-300")}>
          {count === 0 ? (
            <MinicartEmpty content={minicartSettings?.minicartEmpty} />
          ) : (
            <>
              {/* Free Shipping Bar */}
              {Boolean(minicartSettings?.freeShippingBarSettings?.target) && (
                <div class="px-2 py-5 w-full">
                  <FreeShippingProgressBar total={total} locale={locale} currency={currency} settings={minicartSettings?.freeShippingBarSettings} />
                </div>
              )}

              {/* Cart Items */}
              <ul role="list" class="mt-6 pl-6 mr-6 pr-[15px] flex-grow overflow-y-auto flex flex-col gap-5 w-full customizeScroll">
                {items.map((item, index) => (
                  <li>
                    <CartItem item={item} index={index} locale={locale} currency={currency} />
                  </li>
                ))}
              </ul>

              {/* Cart Footer */}
              <MinicartFooter {...props} />
            </>
          )}
        </div>
      </form>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(onLoad, MINICART_FORM_ID),
        }}
      />
    </>
  );
}
