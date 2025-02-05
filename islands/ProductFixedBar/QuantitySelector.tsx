import { Signal } from "@preact/signals";
import { IconMinus } from "site/components/Icons/IconMinus.tsx";
import { IconPlus } from "site/components/Icons/IconPlus.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";

type InputProps =
  & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  & {
    signal: Signal<number>;
  };

type QuantitySelectorProps = InputProps & {
  small?: boolean;
  containerClass?: string;
};

function QuantitySelector(
  {
    id = useId(),
    disabled,
    signal,
    class: className,
    small,
    containerClass,
    ...props
  }: QuantitySelectorProps,
) {
  return (
    <div
      class={clx(
        "join w-full flex gap-[2px]",
        small ? "h-5" : "h-11",
        containerClass,
      )}
    >
      <button
        type="button"
        class={clx(
          "btn btn-circle btn-secondary  no-animation",
          small ? "w-5 h-5 min-h-5" : "w-11 h-11 min-h-11",
        )}
        onClick={() => {
          signal.value = signal.value + 1;
        }}
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
            "input w-[29px] font-bold text-accent text-xs leading-[18px] p-0 border-none text-center flex-grow [appearance:textfield] outline-none",
            "invalid:input-error",
            className?.toString(),
            small ? "h-[18px]" : "h-11",
          )}
          disabled={disabled}
          inputMode="numeric"
          type="number"
          value={signal.value}
          {...props}
        />
      </div>
      <button
        type="button"
        class={clx(
          "btn btn-circle btn-secondary  no-animation",
          small ? "w-5 h-5 min-h-5" : "w-11 h-11 min-h-11",
        )}
        onClick={() => {
          signal.value = Math.max(signal.value + 1, 1);
        }}
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
