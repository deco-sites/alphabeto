import { useSignal, useSignalEffect } from "@preact/signals";
import { IconCheveronsDown } from "site/components/Icons/IconChevronsDown.tsx";
import { MINICART_DRAWER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { formatPrice } from "../../sdk/format.ts";
import { IconCheveronsUp } from "../Icons/IconChevronsUp.tsx";
import { ButtonAnchor, ButtonType } from "../ui/Button.tsx";
import Coupon from "./Coupon.tsx";
import { Props } from "./Minicart.tsx";
import Seller from "./Seller.tsx";
import Shipping from "./Shipping.tsx";

interface PropsSettings {
  props: {
    state: {
      openSeller: boolean;
      openShipping: boolean;
      openCoupon: boolean;
    };
  };
}

export default function MinicartFooter(props: Props) {
  const {
    cart: {
      storefront: {
        total,
        subtotal,
        coupon,
        locale,
        currency,
        enableCoupon = true,
        checkoutHref,
        sellerCode,
        cep,
        shippingValue,
      },
    },
    state,
  } = props;
  const openSeller = useSignal(state?.openSeller ?? false);
  const openCoupon = useSignal(state?.openCoupon ?? false);
  const openShipping = useSignal(state?.openShipping ?? false);
  const hasOneOpenned = openSeller.value || openCoupon.value ||
    openShipping.value;
  const toogleAll = () => {
    if (hasOneOpenned) {
      openSeller.value = false;
      openCoupon.value = false;
      openShipping.value = false;
    } else {
      openSeller.value = true;
      openCoupon.value = true;
      openShipping.value = true;
    }
  };

  const sendBeginCheckoutEvent = () => {
    window.DECO.events.dispatch({
      name: "being_checkout",
      params: window.STOREFRONT.CART.getCart(),
    });
  };

  useSignalEffect(() => {
    const minicartForm = document.getElementById(
      MINICART_FORM_ID,
    ) as HTMLFormElement;
    const postUrl = minicartForm.getAttribute("hx-post");
    if (!postUrl) return;
    const postURL = new URL(
      decodeURIComponent(postUrl),
      window.location.origin,
    );
    const props = JSON.parse(
      postURL.searchParams.get("props") ?? "{}",
    ) as PropsSettings;
    props.props.state.openSeller = openSeller.value;
    props.props.state.openCoupon = openCoupon.value;
    props.props.state.openShipping = openShipping.value;
    postURL.searchParams.set("props", JSON.stringify(props));
    minicartForm.setAttribute("hx-post", postURL.href);
    htmx.process(minicartForm);
  });

  return (
    <footer class="w-full">
      <div className="top-5 relative z-0 flex justify-center">
        <button
          type="button"
          onClick={toogleAll}
          className="btn-circle btn-secondary-content bg-secondary-content w-10 h-10 pt-[5px] flex justify-center"
        >
          {hasOneOpenned
            ? (
              <IconCheveronsDown
                className="w-3 h-3"
                strokeClassName="stroke-primary"
              />
            )
            : (
              <IconCheveronsUp
                className="w-3 h-3"
                strokeClassName="stroke-primary"
              />
            )}
        </button>
      </div>
      <div className="bg-secondary-content z-10 relative px-6">
        {/* Subtotal */}
        <div class="border-b border-secondary border-dashed pt-5 pb-[10px] flex w-full justify-between text-xs leading-[18px] text-[#676767]">
          <span>Subtotal</span>
          <output form={MINICART_FORM_ID} className="font-bold">
            {formatPrice(subtotal, currency, locale)}
          </output>
        </div>
        <Seller openSeller={openSeller} sellerCode={sellerCode} />
        {enableCoupon && <Coupon coupon={coupon} openCoupon={openCoupon} />}
        <Shipping
          cep={cep ?? ""}
          openShipping={openShipping}
          shippingValue={shippingValue ?? 0}
        />
        {/* Total */}
        <div class="border-t border-secondary border-dashed pt-[10px] mt-5 flex flex-col justify-end items-end gap-2">
          <div class="flex justify-between items-center w-full text-sm leading-[21px] font-bold text-[#676767]">
            <span>Total</span>
            <output form={MINICART_FORM_ID} class="text-primary">
              {formatPrice(total, currency, locale)}
            </output>
          </div>
        </div>

        <div class="flex gap-4 items-center py-5">
          <label
            for={MINICART_DRAWER_ID}
            className="text-[13px] leading-[19.5px] font-bold underline text-[#676767] cursor-pointer w-1/2"
          >
            Continuar Comprando
          </label>
          <ButtonAnchor
            styleType={ButtonType.Primary}
            href={checkoutHref}
            className="h-11 w-1/2 minicartCheckout"
            hx-on:click={sendBeginCheckoutEvent}
          >
            <span class="[.minicartContent.htmx-request_&]:hidden">
              Finalizar Compra
            </span>
            <span class="[.minicartContent.htmx-request_&]:inline hidden loading loading-spinner" />
          </ButtonAnchor>
        </div>
      </div>
    </footer>
  );
}
