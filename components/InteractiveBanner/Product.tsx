import { Product } from "apps/commerce/types.ts";
import { useDevice } from "@deco/deco/hooks";
import { relative } from "site/sdk/url.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { formatPrice } from "site/sdk/format.ts";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";

export interface InteractiveBannerProductProps {
  /**@title Name for CMS */
  label: string;
  xPosition: {
    desktop: number;
    mobile: number;
  };
  yPosition: {
    desktop: number;
    mobile: number;
  };
  products: Product[] | null;
}

export default function InteractiveBannerProduct({
  xPosition,
  yPosition,
  products,
}: InteractiveBannerProductProps) {
  if (!products || products.length === 0) return null;
  const [product] = products;

  const device = useDevice();

  const isLargeScreen = device === "desktop" || device === "tablet";
  const finalXPosition = isLargeScreen ? xPosition.desktop : xPosition.mobile;
  const finalYPosition = isLargeScreen ? yPosition.desktop : yPosition.mobile;
  const { url, image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];
  const relativeUrl = relative(url);
  const { listPrice, price } = useOffer(offers);
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const position = isLargeScreen
    ? (xPosition.desktop > 60 ? "left" : "right")
    : "bottom";
  const imageSizes = isLargeScreen
    ? { width: 89, height: 123 }
    : { width: 82, height: 113 };

  const cardAreaClasses = {
    right: "left-11 w-[400px] top-1/2 -translate-y-1/2",
    left: "right-11 w-[400px] top-1/2 -translate-y-1/2",
    bottom:
      "-top-[15%] h-[159px] w-[var(--mobileImageSize)] -translate-y-full -left-[var(--mobileImageLeftCompensation)]",
  };
  const cardClasses = {
    right: "ml-auto w-[385px]",
    left: "mr-auto w-[385px]",
    bottom: "mb-auto w-[304px] h-[137px] mx-auto",
  };
  const triangleIconClasses = {
    right: "left-0 top-1/2	-translate-y-1/2",
    left: "right-0 rotate-180 top-1/2	-translate-y-1/2",
    bottom: "bottom-0 rotate-[30deg] left-[var(--positionX)]	translate-x-3",
  };
  const styles = {
    "--positionX": `${finalXPosition}%`,
    "--positionY": `${finalYPosition}%`,
    "--mobileImageSize": `calc(100dvw	- 40px)`,
    "--mobileImageLeftCompensation":
      `calc((((100dvw - 40px) * ${finalXPosition}) / 100))`,
  };

  return (
    <div
      class="absolute group top-[var(--positionY)] left-[var(--positionX)]"
      style={styles}
    >
      <div class="relative">
        <div class="relative w-11 h-11 flex	items-center justify-center">
          <div class="w-9 h-9 bg-white bg-opacity-50 flex items-center justify-center rounded-full group-hover:bg-opacity-80 group-hover:w-11 group-hover:h-11 transition-all cursor-pointer">
            <div class="w-6 h-6 bg-white rounded-full shadow-[0px_0px_14.69px_0px_rgba(67,67,67,0.25)]" />
          </div>
        </div>
        <div
          class={clx(
            "absolute opacity-0 pointer-events-none group-hover:opacity-100 transition-all group-hover:pointer-events-auto z-10",
            cardAreaClasses[position],
          )}
        >
          <Icon
            id="triangle-interactive-banner-desktop"
            width="28"
            height="33"
            class={clx(
              "absolute",
              triangleIconClasses[position],
            )}
          />
          <div
            class={clx(
              "relative bg-white w-[304px] desk:w-[385px] flex p-2.5 rounded-lg gap-3",
              cardClasses[position],
            )}
          >
            {front.url
              ? (
                <VTEXImageTag
                  src={front.url}
                  alt={title}
                  width={imageSizes.width}
                  height={imageSizes.height}
                  class="rounded-lg"
                />
              )
              : null}
            <div class="flex flex-col">
              <p class="text-[#676767] text-xs leading-[18px] font-bold">
                {title}
              </p>
              <div class="flex items-center mt-2.5 desk:mt-3">
                {hasListPrice && (
                  <>
                    <span class="line-through font-bold text-xs leading-[14px] text-[#C5C5C5]">
                      {formatPrice(listPrice, offers?.priceCurrency)}
                    </span>
                    <span
                      class={"mx-[5px] font-bold text-sm leading-[14px] text-primary"}
                    >
                      •
                    </span>
                  </>
                )}
                <span class="font-bold text-sm leading-4 text-primary">
                  {formatPrice(price, offers?.priceCurrency)}
                </span>
              </div>
              <a
                href={relativeUrl}
                class="text-primary underline text-xs leading-[14px] font-bold mt-1 desk:mt-4"
              >
                Ver produto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
