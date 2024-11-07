import { itemToAnalyticsItem } from "site/sdk/cart/vtex/utils/useCartCustom.ts";
import { Minicart } from "../../../../components/minicart/Minicart.tsx";
import { Cart } from "../types.ts";
import { SkuInformationData } from "./loadSizes.ts";

export const cartFrom = (
  form: Cart,
  url: string,
  skuInformation: Record<string, SkuInformationData>,
): Minicart => {
  const { items, totalizers, openTextField } = form ?? { items: [] };
  const total = totalizers?.find((item) => item.id === "Items")?.value || 0;
  const discounts =
    (totalizers?.find((item) => item.id === "Discounts")?.value || 0) * -1;
  const locale = form?.clientPreferencesData.locale ?? "pt-BR";
  const currency = form?.storePreferencesData.currencyCode ?? "BRL";
  const coupon = form?.marketingData?.coupon ?? undefined;
  const cep = form?.shippingData?.address?.postalCode ?? "";
  const maskCep = (value: string) =>
    value.replace(/\D/g, "").replace(/(\d{5})(\d{3})?/, "$1-$2");
  const shippingValue =
    totalizers?.find((item) => item.id === "Shipping")?.value || 0;

  return {
    platformCart: form as unknown as Record<string, unknown>,
    storefront: {
      items: items.map((item, index) => {
        const detailUrl = new URL(item.detailUrl, url).href;
        const skuInfo = skuInformation[item.id];
        return {
          ...itemToAnalyticsItem({ ...item, detailUrl, coupon }, index, url),
          image: item.imageUrl,
          ...skuInfo,
          listPrice: item.listPrice / 100,
        };
      }),

      total: (total + shippingValue - discounts) / 100,
      subtotal: total / 100,
      discounts: discounts / 100,
      coupon: coupon,
      locale,
      currency,
      checkoutHref: "/checkout",
      sellerCode: openTextField?.value,
      cep: maskCep(cep),
      shippingValue: shippingValue / 100,
    },
  };
};
