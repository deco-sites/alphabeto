import { FilterToggle } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import { isEvenStringNumber, strToNumber } from "site/sdk/stringUtils.ts";

export default function AgeFilter({ values }: FilterToggle) {
  const filterValues = values.filter((value) => isEvenStringNumber(value.label))
    .sort((a, b) => strToNumber(a.label) - strToNumber(b.label));
  return (
    <div class="carousel flex gap-12 w-fit max-w-[calc(100vw_-_40px)] mx-auto">
      {filterValues.map((value) => (
        <a
          href={value.url}
          class={clx(
            "rounded-full font-bold w-20 h-20 flex items-center justify-center text-primary break-all text-center carousel-item text-[20px] leading-[24px] box-border",
            value.selected
              ? "border border-primary bg-secondary"
              : "bg-secondary-content",
          )}
        >
          {value.label}
          <br /> Anos
        </a>
      ))}
    </div>
  );
}
