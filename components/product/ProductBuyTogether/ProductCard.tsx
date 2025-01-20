import { asset } from "$fresh/runtime.ts";
import { useCallback } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import ProductSkuSelector from "site/components/product/ProductBuyTogether/ProductSkuSelector.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import Icon from "site/components/ui/Icon.tsx";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";
import { invoke } from "site/runtime.ts";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { ProductCardProps } from "site/components/product/ProductBuyTogether/types.ts";

export default function ProductCard(props: ProductCardProps) {
  const { isVariantOf, name, aggregateRating } = props.signal.value.product;
  const { image: images, offers } = isVariantOf?.hasVariant.find(
    (variant) => variant.sku === props.signal.value.selectedVariant,
  ) ?? props.signal.value.product;

  const title = isVariantOf?.name ?? name;
  const [front] = images ?? [];

  const { listPrice, price, installments } = useOffer(offers);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const hasListPrice = listPrice && listPrice > (price ?? 0);

  const refresh: JSX.MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      const target = event.currentTarget;
      target.classList.add("htmx-request");
      if (props.mode === "principal") return;
      console.log(props.newProductLoaderData);
      const newSugestionResult = await invoke.site.loaders.BuyTogether
        .getNewProduct(props.newProductLoaderData);
      if (!newSugestionResult) return;
      props.signal.value = {
        product: newSugestionResult.newSugestion,
        enabled: true,
        selectedVariant: newSugestionResult.newSugestion.sku,
      };
      target.classList.remove("htmx-request");
    },
    [props.mode, props.newProductLoaderData],
  );

  return (
    <div class="w-[42.67vw] desk:w-[22.78vw] desk:max-w-[328px] flex flex-col">
      <div class="relative">
        <div
          class={clx(
            "absolute top-2 left-2 desk:top-4 desk:left-4",
            percent > 0 ? "" : "hidden",
          )}
        >
          <div class="relative w-fit">
            <img
              src={asset("/image/DiscountElipse.svg")}
              class="mobile:w-[32px] object-cover"
            />
            <p class="absolute max-w-[34px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-[8px] leading-[8px] desk:text-xs desk:leading-3 text-white text-center">
              {percent}% off
            </p>
          </div>
        </div>
        {front?.url
          ? (
            <VTEXImageTag
              class={clx(
                "rounded-xl desk:max-w-[328px] desk:max-h-[466px] w-full h-full aspect-[328/466]",
                props.mode === "sugestion" && !props.signal.value.enabled
                  ? "opacity-50"
                  : "",
              )}
              width={328}
              height={466}
              src={front.url}
            />
          )
          : null}
        {props.mode === "principal"
          ? (
            <p class="absolute w-[calc(100%_-_32px)] mx-4 bottom-3.5 text-sm flex gap-2.5 items-center justify-center font-bold text-base-300 bg-[#70D1E8] py-2.5 rounded-lg">
              <Icon id="eye" class="min-w-5" size={20} />
              Você está vendo este produto
            </p>
          )
          : null}
        {props.mode === "sugestion"
          ? (
            <div class="absolute top-2.5 right-2.5 desk:top-3.5 desk:right-3.5 flex flex-col gap-2.5 desk:gap-3.5">
              <button
                onClick={refresh}
                class="h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-secondary-content text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)]"
              >
                <div class="hidden [.htmx-request_&]:flex items-center justify-center h-[600px]">
                  <span class="loading loading-spinner"></span>
                </div>
                <Icon
                  class="[.htmx-request_&]:hidden mobile:hidden"
                  id="refresh"
                  size={20}
                  strokeWidth={2}
                />
                <Icon
                  class="[.htmx-request_&]:hidden desk:hidden"
                  id="refresh"
                  size={15}
                  strokeWidth={4}
                />
              </button>
              <button
                onClick={() => {
                  props.signal.value = {
                    ...props.signal.value,
                    enabled: !props.signal.value.enabled,
                  };
                }}
                class={clx(
                  "h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-secondary-content text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)] transition-all",
                  props.signal.value.enabled ? "" : "rotate-45",
                )}
              >
                <Icon
                  class="mobile:hidden"
                  id="close"
                  size={20}
                  strokeWidth={2}
                />
                <Icon
                  id="close"
                  class="desk:hidden"
                  size={15}
                  strokeWidth={4}
                />
              </button>
            </div>
          )
          : null}
        <input type="checkbox" id="product-checkbox" class="hidden" checked />
      </div>
      <ProductRating
        averageRating={aggregateRating?.ratingValue ?? 0}
        maxRating={5}
        iconSize={12}
        class="gap-1 mt-2.5"
      />
      <p
        class="text-accent font-bold text-xs mobile:leading-[18px] desk:text-sm mt-1 desk:mt-2.5 min-h-[42px] max-h-[42px] overflow-hidden"
        style={{
          display: "-webkit-box",
          "--webkit-line-clamp": 2,
          "-webkit-box-orient": "vertical",
        }}
      >
        {title}
      </p>
      <div>
        <div class="flex items-center mt-2.5 desk:mt-5">
          <div
            class={clx("flex items-center", hasListPrice ? "" : "hidden")}
            id="listPriceArea"
          >
            <p
              class="font-bold text-xs leading-[18px] text-[#C5C5C5] line-through"
              id="listPrice"
            >
              {formatPrice(listPrice, offers?.priceCurrency)}
            </p>
            <p class="text-primary text-xs leading-[14px] mx-1.5">•</p>
          </div>
          <p class="font-bold text-primary text-sm mobile:leading-4" id="price">
            {formatPrice(price, offers?.priceCurrency)}
          </p>
        </div>
        <p
          class={clx(
            "text-accent text-xs leading-[18px] font-medium mt-1 mobile:h-9",
            installments ? "" : "hidden",
          )}
          id="installments"
        >
          Em até {installments}
        </p>
        <div class="grid grid-cols-[1fr_98px] gap-1.5 mobile:flex mobile:flex-col mobile:gap-2.5 mt-1 desk:mt-5">
          <ProductSkuSelector signal={props.signal} />
        </div>
      </div>
    </div>
  );
}
