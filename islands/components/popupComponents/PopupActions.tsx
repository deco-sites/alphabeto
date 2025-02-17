import { ProductDetailsPage } from "apps/commerce/types.ts";
import DollPrice from "site/islands/components/DollPrice.tsx";

interface Props {
  product: ProductDetailsPage | null;
}

export default function PopupActions(props: Props) {
  return (
    <span class="flex items-center mt-[16px] mobile:flex-col mobile:text-center">
      <DollPrice product={props.product} />
      <div class="flex items-center justify-end w-full">
        <button //onClick={addMiniMe}
        class="font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[295px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]">
          Adicionar ao carrinho
        </button>
      </div>
    </span>
  );
}
