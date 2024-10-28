import { useScript } from "@deco/deco/hooks";
import { AppContext } from "site/apps/site.ts";
import { MINICART_FORM_ID } from "site/constants.ts";
import { clx } from "site/sdk/clx.ts";
import { useComponent } from "site/sections/Component.tsx";

import FreeShippingProgressBar, {
  FreeShippingSettings,
} from "site/components/minicart/FreeShippingProgressBar.tsx";
import CartItem, { Item } from "site/components/minicart/Item.tsx";
import {
  MinicartEmpty,
  MinicartEmptyProps,
} from "site/components/minicart/MinicartEmpty.tsx";
import { MiniCartError } from "site/components/minicart/MinicartError.ts";
import { ButtonAnchor, ButtonType } from "site/components/ui/Button.tsx";
import MinicartFooter from "site/islands/MinicartFooter.tsx";

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
    sellerCode?: string;
    cep?: string;
    shippingValue?: number;
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
        container?.querySelectorAll("button").forEach((
          node,
        ) => (node.disabled = true));
        container?.querySelectorAll("input").forEach((
          node,
        ) => (node.disabled = true));
      });
    },
  );
};

export interface Props {
  cart: Minicart;
  minicartSettings: MinicartSettings;
  state?: {
    openSeller?: boolean;
    openCoupon?: boolean;
    openShipping?: boolean;
  };
}

const errorMessages = {
  SELLER_CODE_NOT_FOUND: {
    title: "Código do vendedor não encontrado",
    description:
      "O código do vendedor que você digitou não foi encontrado. Tente novamente!",
  },
  COUPON_NOT_FOUND: {
    title: "Cupom não encontrado",
    description:
      "O cupom que você digitou não foi encontrado. Tente novamente!",
  },
  GENERIC: {
    title: "Ocorreu um erro ao atualizar o carrinho",
    description: "Tente novamente!",
  },
};

export const action = async (
  props: {
    minicartSettings: MinicartSettings;
    state: {
      openSeller: boolean;
      openCoupon: boolean;
      openShipping: boolean;
    };
  },
  req: Request,
  ctx: AppContext,
): Promise<Props> => {
  try {
    const cart = req.method === "PATCH"
      ? await ctx.invoke("site/loaders/minicart.ts")
      : await ctx.invoke("site/actions/minicart/submit.ts");
    return {
      cart,
      minicartSettings: props.minicartSettings,
      state: props.state,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message in errorMessages) {
        throw new MiniCartError(error.message, props);
      }
    }
    throw new MiniCartError("GENERIC", props);
  }
};

export function ErrorFallback({ error }: { error?: MiniCartError }) {
  const errorMessage = error?.message ?? "GENERIC";
  const props = error?.props as Props | undefined;
  const message = errorMessages[errorMessage as keyof typeof errorMessages] ??
    errorMessages.GENERIC;
  const reloadPage = props == null;

  return (
    <div class="flex flex-col flex-grow justify-center items-center overflow-hidden w-full gap-2">
      <div class="flex flex-col gap-1 p-6 justify-center items-center">
        <span class="font-semibold">{message.title}</span>
        <span class="text-sm text-center">{message.description}</span>
      </div>
      {reloadPage
        ? (
          <ButtonAnchor
            styleType={ButtonType.Primary}
            hx-on:click={useScript(() => window.location.reload())}
          >
            Recarregar Site
          </ButtonAnchor>
        )
        : (
          <ButtonAnchor
            styleType={ButtonType.Primary}
            class="btn btn-primary"
            hx-patch={useComponent(import.meta.url, {
              ...props,
            })}
            hx-swap="outerHTML"
            hx-target="closest div"
            hx-indicator="this"
            hx-disabled-elt="this"
          >
            <span class="[.htmx-request_&]:hidden">Recarregar Carrinho</span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </ButtonAnchor>
        )}
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
        hx-trigger="submit, change from:.input-qtd delay:300ms"
        hx-target="this"
        hx-swap="outerHTML"
        hx-indicator="this"
        hx-disabled-elt="this, .minicartCheckout"
        hx-post={useComponent(import.meta.url, {
          minicartSettings: minicartSettings,
          state: {
            openSeller: props.state?.openSeller ?? false,
            openCoupon: props.state?.openCoupon ?? false,
            openShipping: props.state?.openShipping ?? false,
          },
        })}
      >
        {/* Button to submit the form */}
        <button hidden autofocus />

        {/* Add to cart controllers */}
        <input name="add-to-cart" type="hidden" />
        <button hidden name="action" value="add-to-cart" />

        {/* This contains the STOREFRONT cart. */}
        <input
          type="hidden"
          name="storefront-cart"
          value={encodeURIComponent(
            JSON.stringify({ coupon, currency, value: total, items }),
          )}
        />

        {/* This contains the platformCart cart from the commerce platform. Integrations usually use this value, like GTM, pixels etc */}
        <input
          type="hidden"
          name="platform-cart"
          value={encodeURIComponent(JSON.stringify(platformCart))}
        />

        <div
          class={clx(
            "flex flex-col flex-grow justify-center items-center overflow-hidden w-full",
            "[.minicartContent.htmx-request_&]:pointer-events-none [.minicartContent.htmx-request_&]:opacity-60 [.minicartContent.htmx-request_&]:cursor-wait transition-opacity duration-300",
          )}
        >
          {count === 0
            ? <MinicartEmpty content={minicartSettings?.minicartEmpty} />
            : (
              <>
                {/* Free Shipping Bar */}
                {Boolean(minicartSettings?.freeShippingBarSettings?.target) && (
                  <div class="px-2 py-5 w-full">
                    <FreeShippingProgressBar
                      total={total}
                      locale={locale}
                      currency={currency}
                      settings={minicartSettings?.freeShippingBarSettings}
                    />
                  </div>
                )}

                {/* Cart Items */}
                <ul
                  role="list"
                  class="mt-6 pl-6 mr-6 pr-[15px] flex-grow overflow-y-auto flex flex-col gap-5 w-full customizeScroll"
                >
                  {items.map((item, index) => (
                    <li>
                      <CartItem
                        item={item}
                        index={index}
                        locale={locale}
                        currency={currency}
                      />
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
