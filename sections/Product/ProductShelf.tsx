import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/site.ts";
import ProductSlider, {
  ProductSliderProps,
} from "site/components/product/ProductSlider.tsx";
import Section from "site/components/ui/Section.tsx";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";

export interface Props extends Omit<ProductSliderProps, "settings"> {
  title?: string;
  products: Product[] | null;
  /**
   * @title List Name for Analytics
   */
  viewItemListName?: string;
}
export function loader(props: Props, _req: Request, app: AppContext) {
  const shelfSettings = {
    colors: app.globalSettings.colors,
    cashbackPercentage: app.globalSettings.cashbackPercentage,
  };
  return {
    ...props,
    shelfSettings,
  };
}
export default function ProductShelf(
  props: ReturnType<typeof loader>,
) {
  const { products, viewItemListName } = props;
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
    <Section.Container {...viewItemListEvent} class="!gap-10 container">
      {props.title && (
        <h2 class="font-beccaPerry mobile:text-[28px] mobile:leading-[33px] text-[40px] leading-[48px] font-medium text-accent">
          {props.title}
        </h2>
      )}
      <ProductSlider
        {...props}
        settings={props.shelfSettings}
      />
    </Section.Container>
  );
}
export const LoadingFallback = () => (
  <Section.Container>
    <Section.Placeholder height="688px" />;
  </Section.Container>
);
