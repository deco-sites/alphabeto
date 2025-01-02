import { Product } from "apps/commerce/types.ts";

export default function useCashback(
  percentage: number,
  product: Product,
): false | number {
  if (percentage <= 0) return false;
  const showCashback = percentage > 0 &&
    product.isVariantOf?.additionalProperty.find((property) =>
        property.name?.toLowerCase() === "mostrar cashback"
      )?.value?.toLowerCase() === "sim";
  if (!showCashback) {
    return false;
  }
  return percentage;
}
