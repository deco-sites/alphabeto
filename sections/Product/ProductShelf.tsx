import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductSlider from "site/components/product/ProductSlider.tsx";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";
import Section from "site/components/ui/Section.tsx";
import { ExportedColorItem } from "site/loaders/savedColors.ts";

export interface Props {
  products: Product[] | null;
  /**
   * @title List Name
   * @description Name of the list of items being viewed used	for analytics
   */
  viewItemListName: string;

  colors: ExportedColorItem[];
}
export default function ProductShelf(
  { products, viewItemListName, colors }: Props,
) {
  if (!products || products.length === 0) {
    return null;
  }
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        item_list_name: viewItemListName,
        items: products.map((product, index) =>
          mapProductToAnalyticsItem({
            index,
            product,
            ...useOffer(product.offers),
          })
        ),
      },
    },
  });
  return (
    <Section.Container {...viewItemListEvent}>
      <ProductSlider
        products={products}
        itemListName={viewItemListName}
        colors={colors}
      />
    </Section.Container>
  );
}
export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="688px" />;
  </Section.Container>
);
