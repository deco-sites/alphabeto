import { useScript } from "@deco/deco/hooks";
import { Product } from "apps/commerce/types.ts";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import useCashback from "site/sdk/useCashback.ts";

interface Props {
  product: Product;
  percentage: number;
  enableClick?: boolean;
}

export default function ProductCashback(props: Props) {
  const percentage = useCashback(props.percentage, props.product);
  if (!percentage) {
    return null;
  }
  const enableClick = props.enableClick ?? false;
  return (
    <div
      class={clx(
        "flex items-center text-primary gap-0.5 text-xs leading-[14px] mobile:leading-[18px] font-bold relative",
        "bg-[#D6DE23] rounded-lg p-1 w-fit mobile:px-2.5 mobile:max-w-[122px]",
        enableClick ? "cursor-pointer" : "cursor-default",
      )}
      hx-on:click={useScript((enableClick: boolean) => {
        if (!enableClick) return;
        const button = document.querySelector<HTMLButtonElement>(
          "button[data-add-to-cart-btn=true]",
        );
        if (!button) return;
        button.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, enableClick)}
    >
      <div class="triangle-cashback absolute -left-2"></div>
      <Icon id="cashback-coin" size={17} />
      <span class="mobile:max-w-[82px]">Ganhe {percentage}% de cashback</span>
    </div>
  );
}
