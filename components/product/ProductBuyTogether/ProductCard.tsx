import { asset } from "$fresh/runtime.ts";
import { asResolved, Resolved } from "@deco/deco";
import { useDevice, useScript } from "@deco/deco/hooks";
import { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { BuyTogetherSDKTag } from "site/components/product/ProductBuyTogether/sdk.tsx";
import Selector from "site/components/product/ProductBuyTogether/Selector.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { BuyTogetherResponse } from "site/loaders/buyTogether.ts";
import { formatPrice } from "site/sdk/format.ts";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useComponent } from "site/sections/Component.tsx";
import { clx } from "site/sdk/clx.ts";

interface Props {
  mode: "principal" | "sugestion";
  product: Product;
  buyTogetherLoader: Resolved<BuyTogetherResponse>;
  itemNameId: string;
}
const updateResume = () => {
  event.detail.xhr.addEventListener("loadend", () => {
    setTimeout(() => {
      window.BUY_TOGETHER?.updateProductResume();
    }, 1000);
  });
};

export default function ProductCard(props: Props) {
  const { product, itemNameId, mode, buyTogetherLoader } = props;
  const { image: images, offers, isVariantOf } = product;
  const title = isVariantOf?.name ?? product.name;
  const [front] = images ?? [];

  const { listPrice, price, installments } = useOffer(offers);
  const percent =
    listPrice && price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const device = useDevice();
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const currentColor =
    product.additionalProperty?.find((property) => property.name === "Cor")
      ?.value ?? "";

  const colors =
    isVariantOf?.hasVariant
      .map((variant) => {
        const color = variant.additionalProperty?.find(
          (value) => value.name === "Cor"
        );
        return {
          label: uppercaseFirstLetter(color?.value?.toLowerCase() ?? ""),
          value: color?.value ?? "",
          selected: color?.value === currentColor,
        };
      })
      .filter(
        (color, index, arr) =>
          color.label !== "" &&
          arr.findIndex((c) => c.label === color.label) === index
      ) ?? [];
  const currentSize =
    product.additionalProperty?.find((property) => property.name === "Tamanho")
      ?.value ?? "";

  const sizes =
    isVariantOf?.hasVariant
      .map((variant) => {
        const size = variant.additionalProperty?.find(
          (value) => value.name === "Tamanho"
        );
        return {
          label: size?.value?.toLowerCase() ?? "",
          value: size?.value ?? "",
          selected: size?.value === currentSize,
        };
      })
      .filter(
        (size, index, arr) =>
          size.label !== "" &&
          arr.findIndex((s) => s.label === size.label) === index
      ) ?? [];
  return (
    <div
      class="w-[42.67vw] desk:w-[22.78vw] desk:max-w-[328px] flex flex-col"
      id={itemNameId}
      data-product-id={product.inProductGroupWithID}
    >
      <div class="relative">
        <div
          class={clx(
            "absolute top-2 left-2 desk:top-4 desk:left-4",
            percent > 0 ? "" : "hidden"
          )}
          id="discountArea"
        >
          <div class="relative w-fit">
            <img
              src={asset("/image/DiscountElipse.svg")}
              class="mobile:w-[32px] object-cover"
            />
            <p
              id="discountPercent"
              class="absolute max-w-[34px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-[8px] leading-[8px] desk:text-xs desk:leading-3 text-white text-center"
            >
              {percent}% off
            </p>
          </div>
        </div>
        {front?.url ? (
          <Image
            id="product-image"
            class="rounded-xl desk:max-w-[328px] desk:max-h-[466px] w-full h-full aspect-[328/466]"
            width={328}
            height={466}
            src={front.url}
          />
        ) : null}
        {mode === "principal" ? (
          <p class="absolute w-[calc(100%_-_32px)] mx-4 bottom-3.5 text-sm flex gap-2.5 items-center justify-center font-bold text-[#2C2C2C] bg-[#70D1E8] py-2.5 rounded-lg">
            <Icon id="eye" class="min-w-5" size={20} />
            Você está vendo este produto
          </p>
        ) : null}
        {mode === "sugestion" ? (
          <div class="absolute top-2.5 right-2.5 desk:top-3.5 desk:right-3.5 flex flex-col gap-2.5 desk:gap-3.5">
            <button
              id="buy-together-refresh"
              hx-target={`#${itemNameId}`}
              hx-select={`#${itemNameId}`}
              hx-swap="outerHTML"
              hx-indicator={`#buy-together-refresh`}
              hx-on-htmx-before-request={useScript(updateResume)}
              hx-get={useComponent(import.meta.resolve("./index.tsx"), {
                buyTogetherLoader: asResolved(buyTogetherLoader),
              })}
              class="h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-[#FDF6ED] text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)]"
            >
              <div class="hidden [.htmx-request_&]:flex items-center justify-center h-[600px]">
                <span class="loading loading-spinner"></span>
              </div>
              <Icon
                class="[.htmx-request_&]:hidden"
                id="refresh"
                size={device === "desktop" ? 20 : 15}
                strokeWidth={device === "desktop" ? 2 : 4}
              />
            </button>
            <button
              id="toogle-product"
              hx-on:click={`window.BUY_TOGETHER.toogleProduct("${product.inProductGroupWithID}")`}
              class="h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-[#FDF6ED] text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)] transition-all"
            >
              <Icon
                id="close"
                size={device === "desktop" ? 20 : 15}
                strokeWidth={device === "desktop" ? 2 : 4}
              />
            </button>
          </div>
        ) : null}
        <input type="checkbox" id="product-checkbox" class="hidden" checked />
      </div>
      <p
        class="text-[#676767] font-bold text-xs mobile:leading-[18px] desk:text-sm mt-1 desk:mt-2.5 min-h-[42px] max-h-[42px] overflow-hidden"
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
            "text-[#676767] text-xs leading-[18px] font-medium mt-1 mobile:h-9",
            installments ? "" : "hidden"
          )}
          id="installments"
        >
          Em até {installments}
        </p>
        <div class="grid grid-cols-[1fr_98px] gap-1.5 mobile:flex mobile:flex-col mobile:gap-2.5 mt-1 desk:mt-5">
          <Selector
            values={colors}
            placeholder="Selecione uma cor"
            selectProps={{
              name: "color",
              id: "color",
              "hx-on:change": `window.BUY_TOGETHER.changeSelector("${product.inProductGroupWithID}")`,
            }}
          />
          <Selector
            values={sizes}
            placeholder="Selecione um tamanho"
            selectProps={{
              name: "size",
              id: "size",
              "hx-on:change": `window.BUY_TOGETHER.changeSelector("${product.inProductGroupWithID}")`,
            }}
          />
        </div>
      </div>
      <BuyTogetherSDKTag product={product} />
    </div>
  );
}
