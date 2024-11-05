import { SignalLike } from "$fresh/src/types.ts";
import { clx } from "../../sdk/clx.ts";

export enum ButtonType {
  Primary,
  Secondary,
  Tertiary,
}

export const typeClasses: Record<ButtonType, {
  common: string;
  hover: string;
  notHover: string;
}> = {
  [ButtonType.Primary]: {
    common: "btn-primary",
    hover: "hover:bg-secondary hover:text-primary hover:border-secondary",
    notHover: "",
  },
  [ButtonType.Secondary]: {
    common: "btn-secondary text-primary",
    hover: "hover:bg-primary hover:text-white",
    notHover: "hover:bg-secondary hover:border-secondary",
  },
  [ButtonType.Tertiary]: {
    common: "btn-primary btn-outline bg-white",
    hover: "hover:bg-primary hover:text-white",
    notHover: "",
  },
};

const disabledClasses =
  "disabled:bg-[#C5C5C5] disabled:border-[#C5C5C5] disabled:text-[#676767] [&[disabled]]:bg-[#C5C5C5] [&[disabled]]:border-[#C5C5C5] [&[disabled]]:text-[#676767]";

export enum TextStyles {
  Small = "text-[14px]",
  Regular = "text-[15px]",
  Large = "text-[16px]",
}

interface MakeFinalClassParam {
  styleType?: ButtonType;
  textStyles?: TextStyles;
  className?: string | SignalLike<string | undefined> | undefined;
  disableHover?: boolean;
}

const makeFinalClass = (
  {
    styleType = ButtonType.Primary,
    textStyles = TextStyles.Small,
    className,
    disableHover = false,
  }: MakeFinalClassParam,
) => {
  const { common, hover, notHover } = typeClasses[styleType];
  return clx(
    "btn",
    common,
    disableHover ? notHover : hover,
    textStyles,
    "rounded-lg",
    disabledClasses,
    className?.toString(),
  );
};

interface CommomButtonProps {
  styleType?: ButtonType;
  textStyles?: TextStyles;
  disableHover?: boolean;
}

type ButtonProps =
  & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
  & CommomButtonProps;

export default function Button(props: ButtonProps) {
  const finalclass = makeFinalClass(
    props,
  );

  return (
    <button
      {...props}
      class={finalclass}
    >
      {props.children}
    </button>
  );
}

type ButtonAnchorProps =
  & React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
  & CommomButtonProps;

export function ButtonAnchor(props: ButtonAnchorProps) {
  const finalclass = makeFinalClass(
    props,
  );
  return (
    <a
      {...props}
      class={finalclass}
    >
      {props.children}
    </a>
  );
}

type ButtonLabelProps =
  & React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
  & CommomButtonProps;

export function ButtonLabel(props: ButtonLabelProps) {
  const finalclass = makeFinalClass(
    props,
  );
  return (
    <label
      {...props}
      class={finalclass}
    >
      {props.children}
    </label>
  );
}
