import { useSignal } from "@preact/signals";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useEffect } from "preact/hooks";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";
import AddToCartButton from "site/islands/ProductFixedBar/AddToCartButton.tsx";
import Selector from "site/islands/Selector.tsx";
import { formatPrice } from "site/sdk/format.ts";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";
import { useOffer } from "site/sdk/useOffer.ts";

interface Props {
  page: ProductDetailsPage | null;
}

interface SkuSelectorValue {
  label: string;
  value: string;
  selected: boolean;
}

interface EventDetail extends Event {
  detail: {
    url: string;
  };
}

export default function ProductFixedBar(props: Props) {
  const product = props.page?.product;
  const currentSkuId = useSignal<string | undefined>(product?.sku);
  const showFixedBar = useSignal(false);
  if (!currentSkuId.value) return null;

  const selectedVariant = props.page?.product?.isVariantOf?.hasVariant.find(
    (variant) => variant.sku === currentSkuId.value,
  ) ?? props.page?.product;

  if (!selectedVariant) return null;

  const { image, offers } = selectedVariant;
  const productName = product?.isVariantOf?.name ?? product?.name;
  const { listPrice, price, seller = "1", availability } = useOffer(offers);
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const item = mapProductToAnalyticsItem({
    product: selectedVariant,
    price,
    listPrice,
  });
  const [front] = image ?? [];

  const colors = product?.isVariantOf?.hasVariant.map((variant) => {
    const color = variant.additionalProperty?.find(
      (value) => value.name === "Cor",
    );
    return {
      label: uppercaseFirstLetter(color?.value?.toLowerCase() ?? ""),
      value: color?.value ?? "",
      selected: variant.sku === currentSkuId.value,
    };
  }).reduce<SkuSelectorValue[]>((acc, value) => {
    const hasColor = acc.findIndex((color) => color.label === value.label);
    const currentIsSelected = value.selected;
    if (hasColor === -1) {
      acc.push(value);
    } else if (currentIsSelected) {
      acc[hasColor] = value;
    }
    return acc;
  }, []);

  const sizes = product?.isVariantOf?.hasVariant.map((variant) => {
    const color = variant.additionalProperty?.find(
      (value) => value.name === "Tamanho",
    );
    return {
      label: `Tam. ${color?.value?.toLowerCase() ?? ""}`,
      value: color?.value ?? "",
      selected: variant.sku === currentSkuId.value,
    };
  }).reduce<SkuSelectorValue[]>((acc, value) => {
    const hasColor = acc.findIndex((color) => color.label === value.label);
    const currentIsSelected = value.selected;
    if (hasColor === -1) {
      acc.push(value);
    } else if (currentIsSelected) {
      acc[hasColor] = value;
    }
    return acc;
  }, []);

  useEffect(() => {
    const pdpChangeUrl = (event: Event) => {
      const ev = event as EventDetail;
      const urlParams = new URL(ev.detail.url, "http://localhost");
      const sku = urlParams.searchParams.get("skuId");
      if (sku) {
        currentSkuId.value = sku;
      }
    };
    globalThis.addEventListener("skuChange", pdpChangeUrl);

    return () => {
      globalThis.removeEventListener("skuChange", pdpChangeUrl);
    };
  }, []);

  useEffect(() => {
    const processScroll = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        showFixedBar.value = window.scrollY > 1200;
      } else {
        showFixedBar.value = window.scrollY > 800;
      }
    };

    globalThis.addEventListener("scroll", processScroll);

    return () => {
      globalThis.removeEventListener("scroll", processScroll);
    };
  }, []);

  if (!showFixedBar.value) return null;

  return (
    <div class="flex justify-between fixed w-[calc(100vw_-_80px)] mobile:w-[calc(100vw_-_32px)] left-1/2 -translate-x-1/2 bottom-3 z-30 bg-white h-20 mobile:h-[72px] items-center mobile:px-2.5 px-5 rounded-lg">
      <div class="flex gap-2 mobile:hidden">
        <VTEXImageTag
          src={front?.url ?? ""}
          alt={productName}
          width={40}
          class="aspect-[40/61] max-h-[61px] object-cover"
          forceSrcWidth={40}
        />
        <div class="flex flex-col gap-2">
          <p class="text-[12px] font-bold leading-[18px] text-[#676767] max-w-[235px] w-full">
            Calça Infantil menina estampa monstrinhos quadradinhos
          </p>
          <div class="flex gap-1 items-center">
            {hasListPrice
              ? (
                <>
                  <p class="text-[12px] font-semibold leading-[14px] text-[#C5C5C5] line-through">
                    {formatPrice(
                      listPrice,
                      offers?.priceCurrency,
                    )}
                  </p>
                  <p class="text-[12px] font-bold leading-[14.4px] text-primary">
                    •
                  </p>
                </>
              )
              : null}
            <p class="text-[14px] font-bold leading-[18px] text-primary">
              {formatPrice(
                price,
                offers?.priceCurrency,
              )}
            </p>
          </div>
        </div>
      </div>
      <div class="flex gap-[30px] mobile:hidden">
        <div class="flex flex-col gap-2 w-[224px]">
          <label class="text-[#676767] font-bold text-[12px] leading-[18px]">
            Selecione a cor:
          </label>
          <Selector
            values={colors ?? []}
            placeholder="Selecione a cor"
            onChange={(value) => {
              document.querySelector<HTMLLabelElement>(
                `label[data-sku='Cor-${value}']`,
              )?.click();
            }}
            posTop
          />
        </div>
        <div class="flex flex-col gap-2 w-[126px]">
          <label class="text-[#676767] font-bold text-[12px] leading-[18px]">
            Selecione o tamanho:
          </label>
          <Selector
            values={sizes ?? []}
            placeholder="Selecione um tamanho"
            onChange={(value) => {
              document.querySelector<HTMLLabelElement>(
                `label[data-sku='Tamanho-${value}']`,
              )?.click();
            }}
            posTop
          />
        </div>
      </div>
      <div class="mobile:w-full">
        {availability?.includes("InStock")
          ? (
            <AddToCartButton
              item={item}
              product={selectedVariant}
              seller={seller}
            />
          )
          : <span>Produto indisponível</span>}
      </div>
    </div>
  );
}
