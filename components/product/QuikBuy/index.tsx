import { ColorItem } from "site/apps/site.ts";
import { clx } from "site/sdk/clx.ts";
import { makeBackgroundFromHexadecimals } from "site/sdk/makeBackgroundFromHexadecimals.ts";

import { Props as ProductCardProps } from "site/components/product/ProductCard.tsx";
import { useComponent } from "site/sections/Component.tsx";
import { ActionProps } from "site/components/product/QuikBuy/RenderCard.tsx";
import { PlataformProps } from "site/components/product/ProductBuyTogether/types.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useDevice, useScript } from "@deco/deco/hooks";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import Button from "site/components/ui/Button.tsx";

interface Props {
  productCardData: ProductCardProps;
  cardId: string;
}

const useStyles = (
  value: string,
  checked: boolean,
  colors: ColorItem[],
) => {
  const hasColor = colors.find(
    (color) => color.name.toLowerCase() === value.toLowerCase(),
  );

  if (hasColor) {
    return {
      bg: makeBackgroundFromHexadecimals(hasColor.hexadecimals),
      class: clx(
        "btn rounded-full w-4 h-4 max-h-4 min-h-4 p-0",
        "ring-1 ring-offset-2",
        checked ? "ring-primary" : "ring-transparent border-none",
      ),
    };
  }
  return {
    class: clx(
      "btn  text-xs leading-[14px] font-medium rounded-full px-[9px] min-w-4 h-4 max-h-4 min-h-4 p-0",
      "ring-1 ring-offset-2",
      checked
        ? "ring-primary bg-primary border-primary text-white"
        : "ring-transparent bg-transparent border-[#5A5B61] text-[#5A5B61] hover:bg-primary hover:border-primary hover:text-white",
    ),
  };
};
const RenderCard = import.meta.resolve("./RenderCard.tsx");
export default function QuickBuy(props: Props) {
  const { product, settings, ...actionSettings } = props.productCardData;
  const device = useDevice();
  const variationsData = product.isVariantOf?.hasVariant.map(
    (variant) => {
      const selected = variant.sku === product.sku;
      const color = variant.additionalProperty?.find((property) =>
        property.name?.toLowerCase() === "cor"
      )?.value;
      const size = variant.additionalProperty?.find((property) =>
        property.name?.toLowerCase() === "tamanho"
      )?.value;
      return {
        color: color,
        size: size,
        sku: variant.sku,
        selected,
      };
    },
  );

  const getAvailableFromSku = (sku: string) => {
    const productVariant = product.isVariantOf?.hasVariant.find((variant) =>
      variant.sku === sku
    );
    if (!productVariant) return false;
    const { availability } = useOffer(productVariant.offers);
    return availability?.toLowerCase().includes("instock") ?? false;
  };

  const selectedColor = variationsData?.find((variant) => variant.selected)
    ?.color;

  const selectedSize = variationsData?.find((variant) => variant.selected)
    ?.size;
  const sizeOptions = (variationsData?.map((variant) => variant.size)
    .filter((value, index, self) =>
      Boolean(value) && self.indexOf(value) === index
    ) ?? []) as string[];
  const colorOptions = (variationsData?.map((variant) => variant.color)
    .filter((value, index, self) =>
      Boolean(value) && self.indexOf(value) === index
    ) ?? []) as string[];

  const getSkuId = (color: string, size: string) => {
    const variant = variationsData?.find(
      (variant) => variant.color === color && variant.size === size,
    );
    if (variant) {
      return variant.sku;
    }
    const firstVariant = variationsData?.[0];
    if (firstVariant) {
      return firstVariant.sku;
    }
    return product.sku;
  };
  const { price, availability } = useOffer(product.offers);
  const image = product.image?.[0].url;
  const plataformProps: PlataformProps = {
    allowedOutdatedData: ["paymentData"],
    orderItems: [{
      quantity: 1,
      seller: "1",
      id: product.sku ?? "1",
    }],
  };
  const item = {
    item_id: product.sku ?? "1",
    listPrice: price ?? 0,
    image: image ?? "",
    color: "",
    size: "",
    item_name: product.name ?? "",
    quantity: 1,
    item_variant: product.sku ?? "",
  };
  type Item = typeof item;

  const addToCart = (
    item: Item,
    plataformProps: PlataformProps,
    MINICART_DRAWER_ID: string,
  ) => {
    window.STOREFRONT.CART.addToCart(item, plataformProps);
    document
      .querySelector<HTMLInputElement>(`input#${MINICART_DRAWER_ID}`)
      ?.click();
  };

  if (device !== "desktop") return null;

  return (
    <div class="group-hover/pcard:opacity-100 opacity-0">
      <div class="absolute bottom-[244px] mobile:hidden w-full bg-white bg-opacity-35 p-5">
        <div class="flex gap-2.5 justify-center flex-wrap">
          {colorOptions.map((color) => {
            const styles = useStyles(
              color,
              selectedColor === color,
              settings.colors,
            );
            return (
              <button
                hx-post={useComponent<ActionProps>(RenderCard, {
                  productCardProps: actionSettings,
                  skuId: getSkuId(color, selectedSize ?? ""),
                })}
                hx-target={`#${props.cardId}`}
                hx-swap="outerHTML"
                class={styles.class}
                style={{ background: styles.bg }}
              />
            );
          })}
        </div>

        <div class="flex gap-2.5 justify-center flex-wrap mt-5">
          {sizeOptions.map((size) => (
            <button
              hx-post={useComponent<ActionProps>(RenderCard, {
                productCardProps: actionSettings,
                skuId: getSkuId(selectedColor ?? "", size),
              })}
              hx-target={`#${props.cardId}`}
              hx-swap="outerHTML"
              class={clx(
                "btn rounded-full max-h-4 px-1 min-h-4",
                "ring-1 ring-offset-2 text-xs leading-[14px] font-medium",
                selectedSize === size
                  ? "ring-primary bg-primary text-white"
                  : "ring-transparent border-none bg-white text-black hover:ring-primary hover:text-white hover:bg-primary ring-offset-[0px]",
                selectedSize !== size &&
                  !getAvailableFromSku(getSkuId(selectedColor ?? "", size))
                  ? "diagonal-line"
                  : "",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      {availability?.toLowerCase().includes("instock")
        ? (
          <Button
            class="w-full"
            hx-on:click={useScript(
              addToCart,
              item,
              plataformProps,
              MINICART_DRAWER_ID,
            )}
          >
            Adicionar ao carrinho
          </Button>
        )
        : (
          <Button
            class="w-full"
            disabled
          >
            Indisponível
          </Button>
        )}
    </div>
  );
}
