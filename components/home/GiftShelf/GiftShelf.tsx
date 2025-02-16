import { ImageWidget } from "apps/admin/widgets.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { AppContext } from "site/apps/site.ts";
import ProductSlider from "site/components/home/GiftShelf/ProductSlider.tsx";
import { ProductSliderProps } from "site/components/product/ProductSlider.tsx";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";

interface GiftShelfProps {
  title: string;
  description: string;
  image: {
    desktopSrc: ImageWidget;
    mobileSrc: ImageWidget;
    alt?: string;
  };
  slider: Omit<ProductSliderProps, "settings">;
}

export function loader(props: GiftShelfProps, _req: Request, app: AppContext) {
  const shelfSettings = {
    colors: app.globalSettings.colors,
    cashbackPercentage: app.globalSettings.cashbackPercentage,
  };
  return {
    ...props,
    shelfSettings,
  };
}

export default function GiftShelf({
  title,
  description,
  image,
  slider,
  shelfSettings,
}: ReturnType<typeof loader>) {
  const id = useId();
  const { products, viewItemListName } = slider;
  if (!products) return null;
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
    <div
      class="flex flex-col container tablet-large:mt-[100px] mt-20"
      {...viewItemListEvent}
    >
      <span class="flex flex-col gap-4">
        <h2 class="font-beccaPerry text-[28px] leading-8 tablet-large:text-[40px] tablet-large:leading-[48px] font-medium text-accent">
          {title}
        </h2>
        <p class="text-accent text-base leading-5 tablet-large:leading-6 font-medium max-w-[224px] tablet-large:max-w-full">
          {description}
        </p>
      </span>
      <div class="tablet-large:grid grid-cols-[1fr_min(46.11vw,_712px)] flex flex-col gap-4 mt-10">
        <Picture>
          <Source
            media="(max-width: 767px)"
            src={image.mobileSrc}
            width={672}
            height={688}
          />
          <Source
            media="(min-width: 768px)"
            src={image.desktopSrc}
            width={355}
            height={329}
          />
          <img
            src={image.desktopSrc}
            alt={image.alt}
            class="w-full tablet-large:aspect-[672/688] aspect-[355/329] rounded-lg object-cover"
          />
        </Picture>
        <ProductSlider id={id} {...slider} settings={shelfSettings} />
      </div>
    </div>
  );
}
