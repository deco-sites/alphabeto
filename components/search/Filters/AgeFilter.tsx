import { FilterToggle } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";

export default function AgeFilter({ values }: FilterToggle) {
  return (
    <div class="carousel flex gap-12 w-fit max-w-[calc(100vw_-_40px)] mx-auto">
      {values.map((value) => (
        <a
          href={value.url}
          class={clx(
            "rounded-full text-base leading-6 font-bold w-20 h-20 flex items-center justify-center text-primary break-all p-1 text-center carousel-item",
            value.selected
              ? "border border-primary bg-secondary"
              : "bg-secondary-content",
          )}
        >
          {value.label}
        </a>
      ))}
    </div>
  );
}
