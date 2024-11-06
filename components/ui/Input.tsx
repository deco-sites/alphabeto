import { clx } from "../../sdk/clx.ts";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Input(props: InputProps) {
  const { class: className, ...rest } = props;
  return (
    <input
      {...rest}
      class={clx(
        "input rounded-lg !outline-none border-secondary focus:border-primary text-xs leading-[18px] text-[#676767] font-medium pl-[10px] disabled:border-[#D8D7D5] disabled:bg-transparent disabled:text-[#D8D7D5]",
        className?.toString() ?? "",
      )}
    >
    </input>
  );
}

export function RadioInput(props: InputProps) {
  const { class: className, ...rest } = props;
  return (
    <input
      {...rest}
      type="radio"
      class={clx(
        "radio radio-primary radio-xs",
        className?.toString() ?? "",
      )}
    >
    </input>
  );
}
