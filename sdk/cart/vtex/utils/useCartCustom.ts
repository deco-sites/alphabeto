import { mapCategoriesToAnalyticsCategories } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { OrderForm, OrderFormItem } from "apps/vtex/utils/types.ts";

const mapItemCategoriesToAnalyticsCategories = (
  item: OrderFormItem,
): Record<`item_category${number | ""}`, string> => {
  return mapCategoriesToAnalyticsCategories(
    Object.values(item.productCategories),
  );
};
export const itemToAnalyticsItem = (
  item: OrderForm["items"][number] & { coupon?: string },
  index: number,
  url: string,
) => ({
  affiliation: item.seller,
  item_id: item.id,
  item_group_id: item.productId,
  quantity: item.quantity,
  coupon: item.coupon ?? "",
  price: item.sellingPrice / 100,
  index,
  discount: Number(((item.listPrice - item.sellingPrice) / 100).toFixed(2)),
  item_name: item.name ?? item.skuName ?? "",
  item_variant: item.skuName,
  item_brand: item.additionalInfo.brandName ?? "",
  item_url: new URL(item.detailUrl, globalThis.location.href).href,
  ...(mapItemCategoriesToAnalyticsCategories(item)),
});
