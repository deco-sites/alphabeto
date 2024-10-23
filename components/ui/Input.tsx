import { clx } from "../../sdk/clx.ts";

export default function Input(props: JSX.IntrinsicElements["input"]) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={clx(
        "input rounded-lg !outline-none border-secondary focus:border-primary text-xs leading-[18px] text-[#676767] font-medium pl-[10px]",
        className,
      )}
    >
    </input>
  );
}
