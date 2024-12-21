import { clx } from "site/sdk/clx.ts";
import Icon from "site/components/ui/Icon.tsx";
import { useSignal } from "@preact/signals";

interface Props {
  maxStars: number;
  minStars: number;
}

export default function StarSelector({ maxStars, minStars }: Props) {
  const startValue = useSignal(1);
  const setStartValue = (value: number) => {
    startValue.value = value;
  };
  return (
    <div>
      <label
        for="stars"
        class="text-[#676767] text-xs leading-[18px] mb-1 mt-[22px] font-bold block"
      >
        Avalie o produto de {minStars} à {maxStars} estrelas:
      </label>
      <input
        name="stars"
        id="stars"
        type="range"
        min={minStars}
        max={maxStars}
        value={startValue.value}
        step="1"
        class="hidden"
      />
      <div class="flex gap-1">
        {[...Array(maxStars)].map((_, index) => (
          <button
            type="button"
            class={clx(
              index < startValue.value ? "text-[#FFE500]" : "text-[#D9D9D9]",
            )}
            onClick={() => setStartValue(index + 1)}
          >
            <Icon id="product_rating_star" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
