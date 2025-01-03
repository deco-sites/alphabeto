import { useSection } from "@deco/deco/hooks";
import type { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import { makeBackgroundFromHexadecimals } from "site/sdk/makeBackgroundFromHexadecimals.ts";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";
import { relative } from "site/sdk/url.ts";
import { useId } from "site/sdk/useId.ts";
import { useVariantPossibilities } from "site/sdk/useVariantPossiblities.ts";
import { ColorItem } from "site/apps/site.ts";

interface Props {
  product: Product;
  colors: ColorItem[];
}

const useStyles = (
  value: string,
  checked: boolean,
  name: string,
  isAvailable: boolean,
  colors: ColorItem[],
) => {
  const hasColor = colors.find(
    (color) => color.name.toLowerCase() === value.toLowerCase(),
  );

  if (hasColor && name.toLowerCase() === "cor") {
    return {
      bg: makeBackgroundFromHexadecimals(hasColor.hexadecimals),
      class: clx(
        "btn rounded-full w-6 h-6 max-h-6 min-h-6 p-0",
        "ring-1 ring-offset-2",
        checked ? "ring-primary" : "ring-transparent border-none",
        checked === false && isAvailable === false ? "diagonal-line" : "",
      ),
    };
  }
  return {
    class: clx(
      "btn  text-xs leading-[14px] font-medium rounded-full min-w-6 h-6 max-h-6 min-h-6 p-0",
      "ring-1 ring-offset-2",
      name.toLowerCase() === "cor" || value.length > 2 ? "px-[9px]" : "",
      checked
        ? "ring-primary bg-primary border-primary text-white"
        : "ring-transparent bg-transparent border-[#5A5B61] text-[#5A5B61] hover:bg-primary hover:border-primary hover:text-white",
      checked === false && isAvailable === false ? "diagonal-line" : "",
    ),
  };
};

const isAvailable = (url: string, product: Product) => {
  return Boolean(
    product.isVariantOf?.hasVariant
      .find((variant) => variant.url === url)
      ?.offers?.offers.find((offer) =>
        offer.availability.toLowerCase().includes("instock")
      ),
  );
};

export const Ring = ({
  value,
  checked = false,
  class: _class,
  name,
  isAvailable,
  colors,
}: {
  value: string;
  checked?: boolean;
  class?: string;
  name: string;
  isAvailable: boolean;
  colors: ColorItem[];
}) => {
  const { class: className, bg } = useStyles(
    value,
    checked,
    name,
    isAvailable,
    colors,
  );
  return (
    <span style={{ background: bg }} class={clx(className, _class)}>
      {bg ? null : value}
    </span>
  );
};

function VariantLabel({
  variantName,
  possibilities,
  product,
}: {
  variantName: string;
  possibilities: ReturnType<typeof useVariantPossibilities>;
  product: Product;
}) {
  let selectedValue = Object.entries(possibilities[variantName]).filter(
    ([_, link]) => link === product.url,
  )[0]?.[0] ?? "";

  const labelsMap = {
    cor: "Selecione a cor",
    tamanho: "Selecione o tamanho",
  };
  const selectedLabelOrDefault =
    labelsMap[variantName.toLowerCase() as keyof typeof labelsMap] ??
      variantName;
  if (variantName.toLowerCase() === "cor") {
    selectedValue = uppercaseFirstLetter(selectedValue.toLowerCase());
  }

  return (
    <span class="text-xs leading-[14px] text-[#353535]">
      <span class="font-bold">{selectedLabelOrDefault}:</span> {selectedValue}
    </span>
  );
}

function VariantSelectorPDP({ product, colors }: Props) {
  const { url, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const relativeUrl = relative(url);
  const id = useId();
  const filteredNames = Object.keys(possibilities).filter(
    (name) =>
      name.toLowerCase() !== "title" && name.toLowerCase() !== "default title",
  );
  if (filteredNames.length === 0) {
    return null;
  }
  return (
    <ul
      class="flex flex-col gap-[30px]"
      hx-target="closest section"
      hx-swap="outerHTML"
      hx-sync="this:replace"
    >
      {filteredNames.map((name) => (
        <li class="flex flex-col gap-3">
          <VariantLabel
            variantName={name}
            possibilities={possibilities}
            product={product}
          />
          <ul class="flex flex-row gap-2.5 flex-wrap">
            {Object.entries(possibilities[name])
              .filter(([value]) => value)
              .map(([value, link]) => {
                const relativeLink = relative(link);
                const checked = relativeLink === relativeUrl;

                return (
                  <li>
                    <label
                      class="cursor-pointer grid grid-cols-1 grid-rows-1 place-items-center"
                      hx-get={useSection({ href: relativeLink })}
                      hx-replace-url={relativeLink}
                    >
                      {/* Checkbox for radio button on the frontend */}
                      <input
                        class="hidden peer"
                        type="radio"
                        name={`${id}-${name}`}
                        checked={checked}
                      />
                      <div
                        class={clx(
                          "col-start-1 row-start-1 col-span-1 row-span-1 relative z-20",
                          "[.htmx-request_&]:opacity-0 transition-opacity h-6",
                        )}
                      >
                        <Ring
                          value={value}
                          checked={checked}
                          name={name}
                          isAvailable={isAvailable(link ?? "", product)}
                          colors={colors}
                        />
                      </div>
                      {/* Loading spinner */}
                      <div
                        class={clx(
                          "col-start-1 row-start-1 col-span-1 row-span-1",
                          "opacity-0 [.htmx-request_&]:opacity-100 transition-opacity",
                          "flex justify-center items-center relative z-10",
                        )}
                      >
                        <span class="loading loading-sm loading-spinner" />
                      </div>
                    </label>
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default VariantSelectorPDP;
