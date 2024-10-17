import { useScript } from "@deco/deco/hooks";
import { MINICART_DRAWER_ID, MINICART_FORM_ID } from "../../constants.ts";
import { formatPrice } from "../../sdk/format.ts";
import { IconCheveronsUp } from "../Icons/IconChevronsUp.tsx";
import { ButtonAnchor, ButtonType } from "../ui/Button.tsx";
import Coupon from "./Coupon.tsx";
import { Props } from "./Minicart.tsx";
import Seller from "./Seller.tsx";
import Shipping from "./Shipping.tsx";

const sendBeginCheckoutEvent = () => {
  window.DECO.events.dispatch({
    name: "being_checkout",
    params: window.STOREFRONT.CART.getCart(),
  });
};

declare global {
  interface Window {
    MINICART_TOOGLER: {
      sellerAreaId: string;
      sellerToogled: boolean;
      toogleSellerCode: () => void;
      load: () => void;
    };
  }
}

interface SellerTooglerSettings {
  sellerAreaId: string;
}

export default function MinicartFooter(props: Props) {
  const {
    cart: {
      storefront: { total, subtotal, coupon, locale, currency, enableCoupon = true, checkoutHref },
    },
  } = props;
  return (
    <footer class="w-full">
      <div className="top-5 relative z-0 flex justify-center">
        <button className="btn-circle btn-secondary-content bg-secondary-content w-10 h-10 pt-[5px] flex justify-center">
          <IconCheveronsUp className="w-3 h-3" strokeClassName="stroke-primary" />
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
        <Seller />
        {enableCoupon && <Coupon coupon={coupon} />}
        <Shipping cep={""} />
        {/* Total */}
        <div class="border-t border-secondary border-dashed pt-[10px] flex flex-col justify-end items-end gap-2">
          <div class="flex justify-between items-center w-full text-sm leading-[21px] font-bold text-[#676767]">
            <span>Total</span>
            <output form={MINICART_FORM_ID} class="text-primary">
              {formatPrice(total, currency, locale)}
            </output>
          </div>
        </div>

        <div class="flex gap-4 items-center py-5">
          <label for={MINICART_DRAWER_ID} className="text-[13px] leading-[19.5px] font-bold underline text-[#676767] cursor-pointer w-1/2">
            Continuar Comprando
          </label>
          <ButtonAnchor styleType={ButtonType.Primary} href={checkoutHref} className="h-11 w-1/2" hx-on:click={useScript(sendBeginCheckoutEvent)}>
            <span class="[.minicartContent.htmx-request_&]:hidden">Finalizar Compra</span>
            <span class="[.minicartContent.htmx-request_&]:inline hidden loading loading-spinner" />
          </ButtonAnchor>
        </div>
      </div>
    </footer>
  );
}
