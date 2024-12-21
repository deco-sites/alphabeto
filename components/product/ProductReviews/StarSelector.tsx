import { useId } from "site/sdk/useId.ts";
import { clx } from "site/sdk/clx.ts";
import Icon from "site/components/ui/Icon.tsx";
import { useScriptAsDataURI } from "@deco/deco/hooks";

interface Props {
  maxStars: number;
  minStars: number;
}

const loadSelector = (id: string) => {
  const input = document.querySelector<HTMLInputElement>(
    `#${id} input[type="range"]`,
  );
  const buttons = document.querySelectorAll<HTMLButtonElement>(`#${id} button`);
  if (!input) return;

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      input.value = String(index + 1);
      buttons.forEach((button, buttonIndex) => {
        button.classList.toggle("text-[#FFE500]", buttonIndex <= index);
      });
    });
  });
};

export default function StarSelector({ maxStars, minStars }: Props) {
  const id = useId();
  return (
    <div id={id}>
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
        step="1"
        class="hidden"
      />
      <div class="flex gap-1">
        {[...Array(maxStars)].map((_, index) => (
          <button
            type="button"
            class={clx(index < minStars ? "text-[#FFE500]" : "text-[#D9D9D9]")}
          >
            <Icon id="product_rating_star" size={16} />
          </button>
        ))}
      </div>
      <script src={useScriptAsDataURI(loadSelector, id)} />
    </div>
  );
}
