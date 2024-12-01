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
  { id = useId(), disabled, class: className, small, ...props }:
    QuantitySelectorProps,
) {
  return (
    <div class={clx("join w-full flex gap-[2px]", small ? "h-5" : "h-11")}>
      <button
        type="button"
        class={clx(
          "btn btn-circle btn-secondary  no-animation",
          small ? "w-5 h-5 min-h-5" : "w-11 h-11 min-h-11",
        )}
        hx-on:click={useScript(onClick, -1)}
        disabled={disabled}
      >
        <IconMinus
          class={clx(small ? "w-[10px] h-[10px]" : "w-[22px] h-[22px]")}
          strokeclass="stroke-primary"
          strokeWidth={small ? 6 : 3}
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
            "input w-[29px] font-bold text-[#676767] text-xs leading-[18px] p-0 border-none text-center flex-grow [appearance:textfield] outline-none",
            "invalid:input-error",
            className?.toString(),
            small ? "h-[18px]" : "h-11",
          )}
          disabled={disabled}
          inputMode="numeric"
          type="number"
          {...props}
        />
      </div>
      <button
        type="button"
        class={clx(
          "btn btn-circle btn-secondary  no-animation",
          small ? "w-5 h-5 min-h-5" : "w-11 h-11 min-h-11",
        )}
        hx-on:click={useScript(onClick, 1)}
        disabled={disabled}
      >
        <IconPlus
          class={clx(small ? "w-[10px] h-[10px]" : "w-[22px] h-[22px]")}
          strokeclass="stroke-primary"
          strokeWidth={small ? 6 : 3}
        />
      </button>
    </div>
  );
}
export default QuantitySelector;
