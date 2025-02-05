import { Product } from "apps/commerce/types.ts";
import { useCallback } from "preact/hooks";
import { ProductSkuSelectorProps } from "site/components/product/ProductBuyTogether/types.ts";
import Selector from "site/islands/Selector.tsx";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";

const checkAvailability = (variant: Product) => {
  return variant.offers?.offers.find((offer) =>
    offer.availability.includes("InStock")
  );
};

export default function ProductSkuSelector(props: ProductSkuSelectorProps) {
  const { mode, signal } = props;
  const { isVariantOf } = signal.value.product;
  const { additionalProperty } = isVariantOf?.hasVariant.find(
    (variant) => variant.sku === signal.value.selectedVariant,
  ) ?? signal.value.product;

  const currentColor =
    additionalProperty?.find((property) => property.name === "Cor")?.value ??
      "";

  const colors = isVariantOf?.hasVariant
    .map((variant) => {
      const color = variant.additionalProperty?.find(
        (value) => value.name === "Cor",
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
        arr.findIndex((c) => c.label === color.label) === index,
    ) ?? [];
  const currentSize =
    additionalProperty?.find((property) => property.name === "Tamanho")
      ?.value ?? "";

  const sizes = isVariantOf?.hasVariant
    .map((variant) => {
      const size = variant.additionalProperty?.find(
        (value) => value.name === "Tamanho",
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
        arr.findIndex((s) => s.label === size.label) === index,
    ) ?? [];
  const handleColorChange = useCallback(
    (newColor: string) => {
      if (mode === "principal") {
        document.querySelector<HTMLLabelElement>(
          `label[data-sku='Cor-${newColor}']`,
        )?.click();
        return;
      }
      const variants = isVariantOf?.hasVariant ?? [];

      const findedVariant = variants.find((variant) => {
        const sameSize = variant.additionalProperty?.find(
          (property) => property.name === "Tamanho",
        )?.value === currentSize;
        if (!sameSize) return false;
        const sameColor = variant.additionalProperty?.find(
          (property) => property.name === "Cor",
        )?.value === newColor;
        if (!sameColor) return false;
        const isAvailable = checkAvailability(variant);
        return isAvailable;
      });
      if (findedVariant) {
        signal.value = {
          ...signal.value,
          selectedVariant: findedVariant.sku,
        };
        return;
      }
      const findedColorVariant = variants.find((variant) => {
        const sameColor = variant.additionalProperty?.find(
          (property) => property.name === "Cor",
        )?.value === newColor;
        if (!sameColor) return false;
        const isAvailable = checkAvailability(variant);
        return isAvailable;
      });
      if (findedColorVariant) {
        alert(
          "Não temos um produto disponível dessa cor com esse tamanho. Escolhemos um produto de outro tamanho mas com essa cor para você.",
        );
        signal.value = {
          ...signal.value,
          selectedVariant: findedColorVariant.sku,
        };
        return;
      }
      alert("Não temos produtos disponíveis com essa cor");
      signal.value = {
        ...signal.value,
      };
    },
    [isVariantOf, currentSize, mode],
  );

  const handleSizeChange = useCallback(
    (newSize: string) => {
      if (mode === "principal") {
        document.querySelector<HTMLLabelElement>(
          `label[data-sku='Tamanho-${newSize}']`,
        )?.click();
        return;
      }

      const variants = isVariantOf?.hasVariant ?? [];
      const findedVariant = variants.find((variant) => {
        const sameColor = variant.additionalProperty?.find(
          (property) => property.name === "Cor",
        )?.value === currentColor;
        if (!sameColor) return false;
        const sameSize = variant.additionalProperty?.find(
          (property) => property.name === "Tamanho",
        )?.value === newSize;
        if (!sameSize) return false;
        const isAvailable = checkAvailability(variant);
        return isAvailable;
      });

      if (findedVariant) {
        signal.value = {
          ...signal.value,
          selectedVariant: findedVariant.sku,
        };

        return;
      }
      const findedSizeVariant = variants.find((variant) => {
        const sameSize = variant.additionalProperty?.find(
          (property) => property.name === "Tamanho",
        )?.value === newSize;
        if (!sameSize) return false;
        const isAvailable = checkAvailability(variant);
        return isAvailable;
      });
      if (findedSizeVariant) {
        alert(
          "Não temos um produto disponível desse tamanho com essa cor. Escolhemos um produto de outra cor com esse tamanho para você.",
        );
        signal.value = {
          ...signal.value,
          selectedVariant: findedSizeVariant.sku,
        };
        return;
      }
      alert("Não temos produtos disponíveis com esse tamanho");
      signal.value = {
        ...signal.value,
      };
    },
    [isVariantOf, currentColor, mode],
  );

  return (
    <>
      <Selector
        values={colors}
        placeholder="Selecione uma cor"
        onChange={handleColorChange}
      />
      <Selector
        values={sizes}
        placeholder="Selecione um tamanho"
        onChange={handleSizeChange}
      />
    </>
  );
}
