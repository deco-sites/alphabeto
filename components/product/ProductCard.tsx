import { useDevice } from "@deco/deco/hooks";
import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { ColorItem } from "site/apps/site.ts";
import ProductRating from "site/components/product/ProductRating.tsx";
import ProductShelfColors from "site/components/product/ProductShelfColors.tsx";
import QuickView from "site/components/product/Quickview/QuickView.tsx";
import Video from "site/components/Video.tsx";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";
import WishlistButton from "site/components/wishlist/WishlistButton.tsx";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";
import { relative } from "site/sdk/url.ts";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;

  /** @description index of the product card in the list */
  index?: number;

  class?: string;

  settings: {
    colors: ColorItem[];
    cashbackPercentage: number;
  };
  lozad?: boolean;
}

const DESKTOP_WIDTH = 500;
const DESKTOP_HEIGHT = 692;

const MOBILE_WIDTH = 500;
const MOBILE_HEIGHT = 692;
const ENABLE_VIDEO_ON_SHELF = false;
const ENABLE_QUICKVIEW = true;

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
  settings,
  lozad,
}: Props) {
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const device = useDevice();
  const [front] = images ?? [];
  const cardId = useId();

  const { listPrice, price, availability, installments } = useOffer(
    offers,
    (installment, sellingPrice) => {
      const { billingDuration, billingIncrement, price } = installment;

      if (!billingDuration || !billingIncrement) {
        return "";
      }

      const withTaxes = sellingPrice < price;

      return `Em até ${billingDuration}x ${
        withTaxes ? "com juros" : "sem juros"
      }`;
    },
  );
  const inStock = availability === "https://schema.org/InStock";
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
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const video = product
    .isVariantOf?.hasVariant.find((variant) => variant.video?.[0].contentUrl)
    ?.video?.[0].contentUrl ??
    null;

  return (
    <div
      {...event}
      class={clx("card card-compact group text-sm", _class)}
      id={cardId}
    >
      <figure
        class={clx(
          "relative",
          "rounded-xl",
          "shelf-image-aspect",
        )}
      >
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "w-full relative",
            "transform transition-transform duration-300 hover:scale-110",
            !inStock && "opacity-70",
          )}
        >
          {/* Video or Image */}
          {video && ENABLE_VIDEO_ON_SHELF
            ? (
              <Video
                src={video}
                class="object-cover rounded w-full col-span-full row-span-full"
                controls={false}
                loop
                autoplay
                muted
                playsinline
                lozad={lozad}
              />
            )
            : (
              <VTEXImageTag
                src={front.url!}
                alt={front.alternateName}
                width={device === "desktop" ? DESKTOP_WIDTH : MOBILE_WIDTH}
                height={device === "desktop" ? DESKTOP_HEIGHT : MOBILE_HEIGHT}
                class={clx(
                  "object-cover",
                  "rounded w-full",
                  "col-span-full row-span-full",
                  "shelf-image-aspect",
                )}
                sizes="(max-width: 640px) 50vw, 20vw"
                preload={preload}
                loading={preload ? "eager" : "lazy"}
                decoding="async"
                lozad={lozad}
              />
            )}
        </a>

        <div class="absolute top-0 left-0 flex items-center justify-between">
          {/* Discounts */}
          <span
            class={clx(
              "bg-[url(https://deco-sites-assets.s3.sa-east-1.amazonaws.com/alphabeto/c8bb9397-459e-4c62-a325-ab0147648a3b/discountBackground.svg)]",
              "tablet-large:p-2.5 p-1.5 text-white text-center bg-cover leading-[8px] tablet-large:leading-3 bg-no-repeat h-[29px] w-[32px] tablet-large:h-[50px] tablet-large:w-[55px] flex items-center",
              "justify-center font-semibold tablet-large:font-medium text-[8px] tablet-large:text-[11px] tablet-large:m-4 m-2",
              (percent < 1 || !inStock) && "opacity-0",
            )}
          >
            {percent}% off
          </span>
        </div>
        {/* Wishlist button */}
        <div class="absolute top-0 right-0 m-2.5 tablet-large::m-[14px]">
          <WishlistButton mode="productCard" item={item} />
        </div>
      </figure>
      <ProductRating
        iconSize={device === "desktop" ? 12 : 10}
        maxRating={5}
        averageRating={product.aggregateRating?.ratingValue ?? 0}
        class="gap-[2px] tablet-large:gap-1 mt-2.5"
      />

      <a
        href={relativeUrl}
        class="pt-1 tablet-large:pt-2.5 pb-7 tablet-large:pb-4"
      >
        {/* Product Name */}
        <span
          style={{
            display: "-webkit-box",
            "--webkit-line-clamp": device === "desktop" ? 2 : 4,
            "-webkit-box-orient": "vertical",
          }}
          class="font-bold text-accent text-xs leading-[18px] tablet-large:text-sm tablet-large:leading-5 overflow-hidden max-h-[72px] h-[72px] tablet-large:h-[42px] tablet-large:max-h-[42px]"
        >
          {title}
        </span>

        <div class="flex pt-2.5 tablet-large:pt-5 flex-col">
          <div class="flex items-center">
            {hasListPrice && (
              <>
                <span class="line-through font-bold text-xs leading-[18px] text-[#C5C5C5]">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
                <span
                  class={"mx-[5px] font-bold text-xs leading-[14px] text-primary"}
                >
                  •
                </span>
              </>
            )}
            <span class="font-bold text-[12px] leading-[14px] tablet-large:text-sm text-primary">
              {formatPrice(price, offers?.priceCurrency)}
            </span>
          </div>
          <span class="text-accent text-[12px] leading-[14px] tablet-large:text-sm font-medium mt-[5px]">
            {installments}
          </span>
        </div>
      </a>

      {/* SKU Selector */}
      <ProductShelfColors product={product} colors={settings.colors} />
      {inStock && ENABLE_QUICKVIEW
        ? (
          <QuickView
            product={product}
            cardId={cardId}
            settings={settings}
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
  );
}

export default ProductCard;
