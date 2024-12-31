import { Product } from "apps/commerce/types.ts";
import { ExportedColorItem } from "site/loaders/savedColors.ts";
import { useVariantPossibilities } from "site/sdk/useVariantPossiblities.ts";
import { makeBackgroundFromHexadecimals } from "site/sdk/makeBackgroundFromHexadecimals.ts";
import { clx } from "site/sdk/clx.ts";
import { relative } from "site/sdk/url.ts";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";

interface Props {
  product: Product;
  colors: ExportedColorItem[];
}

const useStyles = (
  value: string,
  checked: boolean,
  colors: ExportedColorItem[],
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
export default function ProductShelfColors({ product, colors }: Props) {
  const { isVariantOf, url } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  return (
    <div class="flex itens-center m-[3px] gap-1.5 flex-wrap">
      {variants.map(([name, url]) => {
        const { bg, class: className } = useStyles(
          name,
          relative(url) === relativeUrl,
          colors,
        );
        return (
          <a
            href={relative(url)}
            key={name}
            class={className}
            style={{ background: bg }}
          >
            {bg ? "" : uppercaseFirstLetter(name.toLowerCase())}
          </a>
        );
      })}
    </div>
  );
}
