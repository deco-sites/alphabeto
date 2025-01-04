import { clx } from "site/sdk/clx.ts";

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
      class={clx("radio radio-primary radio-xs", className?.toString() ?? "")}
    >
    </input>
  );
}

export function CheckboxInput(props: InputProps) {
  const { class: className, ...rest } = props;
  return (
    <input
      {...rest}
      type="checkbox"
      class={clx(
        "checkbox checkbox-sm checked:[--chkbg:#D6DE23] [--chkfg:#FF8300] [--chkbg:#FF8300] border-[#FF8300] checked:border-[#D6DE23] rounded-[3px] disabled:border-[#676767] disabled:[--chkbg:#E8E7E5]",
        className?.toString() ?? "",
      )}
    >
    </input>
  );
}

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export function TextArea(props: TextAreaProps) {
  const { class: className, ...rest } = props;
  return (
    <textarea
      {...rest}
      class={clx(
        "input py-[13px] rounded-lg !outline-none border-secondary focus:border-primary text-xs leading-[18px] text-[#676767] font-medium pl-[10px] disabled:border-[#D8D7D5] disabled:bg-transparent disabled:text-[#D8D7D5]",
        className?.toString() ?? "",
      )}
    >
    </textarea>
  );
}
