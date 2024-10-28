import { clx } from "../../sdk/clx.ts";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export default function Input(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clx(
        "input rounded-lg !outline-none border-secondary focus:border-primary text-xs leading-[18px] text-[#676767] font-medium pl-[10px]",
        className?.toString() ?? "",
      )}
    >
    </input>
  );
}

export function RadioInput(props: InputProps) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      type="radio"
      className={clx(
        "radio radio-primary radio-xs",
        className?.toString() ?? "",
      )}
    >
    </input>
  );
}
