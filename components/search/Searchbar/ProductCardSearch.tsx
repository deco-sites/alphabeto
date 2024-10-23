import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../../sdk/clx.ts";
import { formatPrice } from "../../../sdk/format.ts";
import { relative } from "../../../sdk/url.ts";
import { useOffer } from "../../../sdk/useOffer.ts";
import { useSendEvent } from "../../../sdk/useSendEvent.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;
}

const WIDTH = 73;
const HEIGHT = 102;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCardSearch({ product, preload, itemListName, index, class: _class }: Props) {
  const { url, image: images, offers, isVariantOf } = product;

  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, availability } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";

  const relativeUrl = relative(url);

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {
    /* Add click event to dataLayer */
  }
  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  return (
    <div {...event} class={clx("card card-side text-sm gap-1", _class)}>
      <figure class={clx("relative", "rounded border border-transparent", "w-[73px] min-w-[73px] h-[102px]")} style={{ aspectRatio: ASPECT_RATIO }}>
        {/* Product Images */}
        <a href={relativeUrl} aria-label="view product" class={clx("absolute top-0 left-0", "grid grid-cols-1 grid-rows-1", "w-full", !inStock && "opacity-70")}>
          <Image src={front.url!} alt={front.alternateName} width={WIDTH} height={HEIGHT} style={{ aspectRatio: ASPECT_RATIO }} class={clx("object-cover", "rounded w-full", "col-span-full row-span-full")} sizes="(max-width: 640px) 50vw, 20vw" preload={preload} loading={preload ? "eager" : "lazy"} decoding="async" />
          <Image src={back?.url ?? front.url!} alt={back?.alternateName ?? front.alternateName} width={WIDTH} height={HEIGHT} style={{ aspectRatio: ASPECT_RATIO }} class={clx("object-cover", "rounded w-full", "col-span-full row-span-full", "transition-opacity opacity-0 lg:group-hover:opacity-100")} sizes="(max-width: 640px) 50vw, 20vw" loading="lazy" decoding="async" />
        </a>
      </figure>

      <a href={relativeUrl} className="">
        <span class="font-bold text-base-content lg:text-accent text-xs leading-[18px]">{title}</span>

        <div class="flex items-center gap-[5px] pt-4">
          {Boolean(listPrice) && (
            <>
              <span class="line-through text-xs leading-[14.4px] font-semibold text-[#c5c5c5]">{formatPrice(listPrice, offers?.priceCurrency)}</span>
              <span class="text-sm leading-[14.4px] font-semibold text-primary">•</span>
            </>
          )}
          <span class="text-sm leading-[16.8px] font-bold text-primary">{formatPrice(price, offers?.priceCurrency)}</span>
        </div>
      </a>
    </div>
  );
}

export default ProductCardSearch;
