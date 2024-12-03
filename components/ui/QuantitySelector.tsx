import { useScript } from "@deco/deco/hooks";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { IconMinus } from "../Icons/IconMinus.tsx";
import { IconPlus } from "../Icons/IconPlus.tsx";

const onClick = (delta: number) => {
  event!.stopPropagation();
  const button = event!.currentTarget as HTMLButtonElement;
  const input = button.parentElement?.querySelector<HTMLInputElement>(
    'input[type="number"]',
  )!;
  const min = Number(input.min) || -Infinity;
  const max = Number(input.max) || Infinity;
  input.value = `${Math.min(Math.max(input.valueAsNumber + delta, min), max)}`;
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type QuantitySelectorProps = InputProps & {
  small?: boolean;
};

function QuantitySelector(
  { id = useId(), disabled, class: className, ...props }: QuantitySelectorProps,
) {
  return (
    <div class="join w-full h-5 flex gap-[2px]">
      <button
        type="button"
        class="btn btn-circle btn-secondary w-5 h-5 min-h-5 no-animation"
        hx-on:click={useScript(onClick, -1)}
        disabled={disabled}
      >
        <IconMinus
          class="w-[10px] h-[10px]"
          strokeclass="stroke-primary"
          strokeWidth={6}
        />
      </button>
      <div
        data-tip={`Quantity must be between ${props.min} and ${props.max}`}
        class={clx(
          "flex-grow join-item",
          "flex justify-center items-center",
          "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom",
        )}
      >
        <input
          id={id}
          class={clx(
            "input w-[29px] h-[18px] font-bold text-[#676767] text-xs leading-[18px] p-0 border-none text-center flex-grow [appearance:textfield]",
            "invalid:input-error",
            className?.toString(),
          )}
          disabled={disabled}
          inputMode="numeric"
          type="number"
          {...props}
        />
      </div>
      <button
        type="button"
        class="btn btn-circle btn-secondary w-5 h-5 min-h-5 no-animation"
        hx-on:click={useScript(onClick, 1)}
        disabled={disabled}
      >
        <IconPlus
          class="w-[10px] h-[10px]"
          strokeclass="stroke-primary"
          strokeWidth={6}
        />
      </button>
    </div>
  );
}
export default QuantitySelector;
