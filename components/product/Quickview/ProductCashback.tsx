import { Product } from "apps/commerce/types.ts";
import useCashback from "site/sdk/useCashback.ts";

interface Props {
  product: Product;
  percentage: number;
}

export default function ProductCashback(props: Props) {
  const percentage = useCashback(props.percentage, props.product);
  if (!percentage) {
    return null;
  }
  return (
    <div class="relative inline-block mt-3">
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#D6DE23]" />
      <span class="flex relative z-10 bg-[#D6DE23] text-primary font-bold p-[5px] rounded-lg text-xs transition">
        <img
          src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/alphabeto/765ee7fe-12a3-4a7e-b7e1-4d17c13f48b8/Accounting-Coins--Streamline-Ultimate.svg.svg"
          alt="Ícone de moeda"
          class="mr-[3px]"
        />
        Ganhe {percentage}% de cashback
      </span>
    </div>
  );
}
