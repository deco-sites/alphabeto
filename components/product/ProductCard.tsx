import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import Ring from "site/components/product/ProductCardRing.tsx";
import QuickView from "site/components/product/quickview/QuickView.tsx";
import WishlistButton from "site/components/wishlist/WishlistButton.tsx";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";
import { relative } from "site/sdk/url.ts";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";
import { useVariantPossibilities } from "site/sdk/useVariantPossiblities.ts";

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

const WIDTH = 466;
const HEIGHT = 466;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const { listPrice, price, seller = "1", availability, installments } =
    useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  {/* Add click event to dataLayer */}
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

  //Added it to check the variant name in the SKU Selector later, so it doesn't render the SKU to "shoes size" in the Product Card
  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  return (
    <div
      {...event}
      class={clx("card card-compact group text-sm", _class)}
    >
      <figure
        class={clx(
          "relative bg-base-200 h-[466px]",
          "rounded border border-transparent",
          "group-hover:border-primary",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full",
            "transform transition-transform duration-300 hover:scale-110",
            !inStock && "opacity-70",
          )}
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover h-[466px]",
              "rounded w-full",
              "col-span-full row-span-full",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover h-[466px]",
              "rounded w-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Wishlist button */}
        <div class="absolute top-0 left-0 flex items-center justify-between">
          {/* Discounts */}
          <span
            class={clx(
              "bg-[url(https://deco-sites-assets.s3.sa-east-1.amazonaws.com/alphabeto/c8bb9397-459e-4c62-a325-ab0147648a3b/discountBackground.svg)] p-[10px] text-white text-center bg-cover bg-no-repeat h-[50px] w-[55px] flex items-center justify-center font-medium text-[11px] m-4",
              (percent < 1 || !inStock) && "opacity-0",
            )}
          >
            {percent}% off
          </span>
        </div>

        <div class="absolute top-0 right-0 m-[14px]">
          <WishlistButton item={item} />
        </div>
      </figure>

      <a href={relativeUrl} class="pt-5">
        <span class="font-bold text-[#676767] text-sm leading-[21px] ">
          {title}
        </span>

        <div class="flex pt-2 flex-col">
          <div class={"flex"}>
            {listPrice && (
              <>
                <span class="line-through font-bold text-xs leading-[18px] text-[#C5C5C5]">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
                <span class={"mx-[5px] font-bold text-sm text-[#FF8300]"}>
                  •
                </span>
              </>
            )}
            <span class="font-bold text-sm leading-[21px] text-[#FF8300]">
              {formatPrice(price, offers?.priceCurrency)}
            </span>
          </div>
          <span
            class={"text-[#676767] text-xs font-medium leading-[18px] mt-[5px]"}
          >
            {installments}
          </span>
        </div>
      </a>

      {/* SKU Selector */}
      {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto">
          {variants.map(([value, link]) => [value, relative(link)] as const)
            .map(([value, link]) => (
              <li>
                <a href={link} class="cursor-pointer">
                  <input
                    class="peer invisible"
                    type="radio"
                    name={`${id}-${firstSkuVariations?.[0]}`}
                    checked={link === relativeUrl}
                  />
                  <Ring value={value} checked={link === relativeUrl} />
                </a>
              </li>
            ))}
        </ul>
      )}

      <div>
        {inStock
          ? (
            <QuickView
              product={product}
              seller={seller}
              item={item}
            />
          )
          : (
            <a
              href={relativeUrl}
              class={clx(
                "btn",
                "btn-outline justify-start border-none !text-sm !font-medium px-0 no-animation w-full",
                "hover:!bg-transparent",
                "disabled:!bg-transparent disabled:!opacity-75",
                "btn-error hover:!text-error disabled:!text-error",
              )}
            >
              Indisponível
            </a>
          )}
      </div>
    </div>
  );
}

export default ProductCard;
