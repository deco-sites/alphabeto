import { Head } from "$fresh/runtime.ts";
import { useScript } from "@deco/deco/hooks";
import { type Person } from "apps/commerce/types.ts";
import * as Htmx from "npm:htmx.org";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import { type AppContext } from "../apps/site.ts";
import { useComponent } from "../sections/Component.tsx";
import { type Item } from "./minicart/Item.tsx";
import CartProvider, {
  type Minicart,
  MinicartSettings,
} from "./minicart/Minicart.tsx";
import Drawer from "./ui/Drawer/index.tsx";
import UserProvider from "./user/Provider.tsx";
import WishlistProvider, { type Wishlist } from "./wishlist/Provider.tsx";

declare global {
  const htmx: typeof Htmx;

  interface Window {
    STOREFRONT: SDK;
    htmx: typeof Htmx;
  }
}
export interface Cart {
  currency: string;
  coupon: string;
  value: string;
  items: Item[];
}
export interface SDK {
  CART: {
    getCart: () => Cart | null;
    getQuantity: (itemId: string) => number | undefined;
    setQuantity: (itemId: string, quantity: number) => boolean;
    addToCart: (item: Item, platformProps: unknown) => boolean;
    subscribe: (
      cb: (sdk: SDK["CART"]) => void,
      opts?: boolean | AddEventListenerOptions,
    ) => void;
    dispatch: (form: HTMLFormElement) => void;
  };
  USER: {
    getUser: () => Person | null;
    subscribe: (
      cb: (sdk: SDK["USER"]) => void,
      opts?: boolean | AddEventListenerOptions,
    ) => void;
    dispatch: (person: Person) => void;
  };
  WISHLIST: {
    toggle: (productID: string, productGroupID: string) => boolean;
    inWishlist: (productID: string) => boolean;
    subscribe: (
      cb: (sdk: SDK["WISHLIST"]) => void,
      opts?: boolean | AddEventListenerOptions,
    ) => void;
    dispatch: (form: HTMLFormElement) => void;
  };
}

const sdk = () => {
  const target = new EventTarget();
  const createCartSDK = (): SDK["CART"] => {
    let form: HTMLFormElement | null = null;
    const getCart = (): Cart =>
      form &&
      JSON.parse(
        decodeURIComponent(
          form.querySelector<HTMLInputElement>('input[name="storefront-cart"]')
            ?.value || "[]",
        ),
      );
    const sdk: SDK["CART"] = {
      getCart,
      getQuantity: (itemId) =>
        form?.querySelector<HTMLInputElement>(
          `[data-item-id="${itemId}"] input[type="number"]`,
        )?.valueAsNumber,
      setQuantity: (itemId, quantity) => {
        const input = form?.querySelector<HTMLInputElement>(
          `[data-item-id="${itemId}"] input[type="number"]`,
        );
        const item = getCart()?.items.find(
          (item) =>
            // deno-lint-ignore no-explicit-any
            (item as any).item_id === itemId,
        );
        if (!input || !item) {
          return false;
        }
        input.value = quantity.toString();
        if (input.validity.valid) {
          window.DECO.events.dispatch({
            name: item.quantity < input.valueAsNumber
              ? "add_to_cart"
              : "remove_from_cart",
            params: { items: [{ ...item, quantity }] },
          });
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        return true;
      },
      addToCart: (item, platformProps) => {
        const input = form?.querySelector<HTMLInputElement>(
          'input[name="add-to-cart"]',
        );
        const button = form?.querySelector<HTMLButtonElement>(
          `button[name="action"][value="add-to-cart"]`,
        );
        if (!input || !button) {
          return false;
        }
        window.DECO.events.dispatch({
          name: "add_to_cart",
          params: { items: { item } },
        });
        input.value = encodeURIComponent(JSON.stringify(platformProps));
        button.click();
        return true;
      },
      subscribe: (cb, opts) => {
        target.addEventListener("cart", () => cb(sdk), opts);
        if (form) {
          cb(sdk);
        }
      },
      dispatch: (f: HTMLFormElement) => {
        form = f;
        target.dispatchEvent(new Event("cart"));
      },
    };
    return sdk;
  };
  const createAnalyticsSDK = () => {
    addEventListener("load", () => {
      function sendEvent(e: Element | null) {
        const event = e?.getAttribute("data-event");
        if (!event) {
          return;
        }
        const decoded = JSON.parse(decodeURIComponent(event));
        window.DECO.events.dispatch(decoded);
      }
      function handleClick(e: Event) {
        e.stopPropagation();
        sendEvent(e.currentTarget as HTMLElement | null);
      }
      // Only available on newer safari versions
      const handleView = typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((items) => {
          for (const item of items) {
            const { isIntersecting, target } = item;
            if (!isIntersecting) {
              continue;
            }
            handleView!.unobserve(target);
            sendEvent(target);
          }
        })
        : null;
      document.body.addEventListener("htmx:load", (e) =>
        (
          e as unknown as {
            detail: {
              elt: HTMLElement;
            };
          }
        ).detail.elt
          .querySelectorAll("[data-event]")
          .forEach((node) => {
            const maybeTrigger = node.getAttribute("data-event-trigger");
            const on = maybeTrigger === "click" ? "click" : "view";
            if (on === "click") {
              node.addEventListener("click", handleClick, {
                passive: true,
              });
              return;
            }
            if (on === "view") {
              handleView?.observe(node);
              return;
            }
          }));
    });
  };
  const createUserSDK = () => {
    let person: Person | null = null;
    const sdk: SDK["USER"] = {
      getUser: () => person,
      subscribe: (cb, opts) => {
        target.addEventListener("person", () => cb(sdk), opts);
        cb(sdk);
      },
      dispatch: (p: Person) => {
        person = p;
        target.dispatchEvent(new Event("person"));
      },
    };
    return sdk;
  };
  const createWishlistSDK = () => {
    let form: HTMLFormElement | null = null;
    let productIDs: Set<string> = new Set();
    const sdk: SDK["WISHLIST"] = {
      toggle: (productID: string, productGroupID: string) => {
        if (!form) {
          console.error("Missing wishlist Provider");
          return false;
        }
        form.querySelector<HTMLInputElement>('input[name="product-id"]')!
          .value = productID;
        form.querySelector<HTMLInputElement>('input[name="product-group-id"]')!
          .value = productGroupID;
        form.querySelector<HTMLButtonElement>("button")?.click();
        return true;
      },
      inWishlist: (id: string) => productIDs.has(id),
      subscribe: (cb, opts) => {
        target.addEventListener("wishlist", () => cb(sdk), opts);
        cb(sdk);
      },
      dispatch: (f: HTMLFormElement) => {
        form = f;
        const script = f.querySelector<HTMLScriptElement>(
          'script[type="application/json"]',
        );
        const wishlist: Wishlist | null = script
          ? JSON.parse(script.innerText)
          : null;
        productIDs = new Set(wishlist?.productIDs);
        target.dispatchEvent(new Event("wishlist"));
      },
    };
    return sdk;
  };
  createAnalyticsSDK();
  window.STOREFRONT = {
    CART: createCartSDK(),
    USER: createUserSDK(),
    WISHLIST: createWishlistSDK(),
  };
};

export const action = async (
  props: {
    minicartSettings: MinicartSettings;
  },
  _req: Request,
  ctx: AppContext,
) => {
  const [minicart, wishlist, user] = await Promise.all([
    ctx.invoke("site/loaders/minicart.ts"),
    ctx.invoke("site/loaders/wishlist.ts"),
    ctx.invoke("site/loaders/user.ts"),
  ]);
  return {
    mode: "eager",
    minicart,
    wishlist,
    user,
    minicartClientSettings: props.minicartSettings,
  };
};

export const loader = (
  { minicartEmpty, freeShippingBarSettings, ...otherProps }: MinicartSettings,
  _req: Request,
  _ctx: AppContext,
) => {
  return {
    ...otherProps,
    minicartClientSettings: {
      minicartEmpty,
      freeShippingBarSettings,
    },
    mode: "lazy",
  };
};

export interface Props {
  minicart?: Minicart | null;
  minicartClientSettings: MinicartSettings;
  wishlist?: Wishlist | null;
  user?: Person | null;
  mode?: "eager" | "lazy";
}

export default function Session(
  { minicart, wishlist, user, mode = "lazy", ...props }: Props,
) {
  if (mode === "lazy") {
    return (
      <>
        <Head>
          <script
            type="module"
            dangerouslySetInnerHTML={{ __html: useScript(sdk) }}
          />
        </Head>
        <div
          hx-trigger="load"
          hx-post={useComponent(import.meta.url, {
            minicartSettings: props.minicartClientSettings,
          })}
        />
      </>
    );
  }

  return (
    <>
      {/* Minicart Drawer */}
      <Drawer
        id={MINICART_DRAWER_ID}
        class="drawer-end z-50"
        aside={
          <Drawer.Aside
            title="Minha sacola"
            drawer={MINICART_DRAWER_ID}
            class="max-w-full desk:max-w-[375px] desk:w-full"
          >
            <div class="h-full flex flex-col bg-base-100 items-center justify-center overflow-auto border-none w-full">
              <CartProvider
                cart={minicart!}
                minicartSettings={props.minicartClientSettings}
              />
            </div>
          </Drawer.Aside>
        }
      />

      <WishlistProvider wishlist={wishlist ?? null} />
      <UserProvider user={user ?? null} />
    </>
  );
}
