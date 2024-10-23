import { itemToAnalyticsItem } from "apps/vtex/hooks/useCart.ts";
import { Minicart } from "../../../../components/minicart/Minicart.tsx";
import { Cart } from "../types.ts";
import { SkuInformationData } from "./loadSizes.ts";

export const cartFrom = (
  form: Cart,
  url: string,
  skuInformation: Record<string, SkuInformationData>,
): Minicart => {
  const { items, totalizers } = form ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = form?.clientPreferencesData.locale ?? "pt-BR";
  const currency = form?.storePreferencesData.currencyCode ?? "BRL";
  const coupon = form?.marketingData?.coupon ?? undefined;

  return {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;
        const skuInfo = skuInformation[item.id];
        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index),
          image: item.imageUrl,
          ...skuInfo,
          listPrice: item.listPrice / 100,
        };
      }),

      total: (total - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon: coupon,
      locale,
      currency,
      checkoutHref: "/checkout",
    },
  };
};
