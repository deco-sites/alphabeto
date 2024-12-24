import { Product } from "apps/commerce/types.ts";

export interface Props {
  product: Product;
}

export default function ProductSmallDescription({ product }: Props) {
  const fulllDescription = product.description ||
    product.isVariantOf?.description;

  if (!fulllDescription) return null;

  const toFirstDot = fulllDescription.indexOf(".");
  const shortDescription = fulllDescription.slice(0, toFirstDot + 1);

  return (
    <p class="text-xs leading-[18px] font-medium text-[#7E7F88]">
      {shortDescription}
    </p>
  );
}
