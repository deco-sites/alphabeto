import { Product } from "apps/commerce/types.ts";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  product: Product;
  percentage: number;
}

export default function ProductCashback({ product, percentage }: Props) {
  const showCashback = percentage > 0 &&
    product.isVariantOf?.additionalProperty.find((property) =>
        property.name?.toLowerCase() === "mostrar cashback"
      )?.value?.toLowerCase() === "sim";
  if (!showCashback) {
    return null;
  }
  return (
    <div class="flex items-center text-primary gap-0.5 text-xs leading-[14px] mobile:leading-[18px] font-bold relative bg-[#D6DE23] rounded-lg p-1 w-fit mobile:px-2.5 mobile:max-w-[122px]">
      <div class="triangle-cashback absolute -left-2"></div>
      <Icon id="cashback-coin" size={17} />
      <span class="mobile:max-w-[82px]">Ganhe {percentage}% de cashback</span>
    </div>
  );
}
