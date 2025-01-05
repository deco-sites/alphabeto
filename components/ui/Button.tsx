import { clx } from "../../sdk/clx.ts";

export enum ButtonType {
  Primary,
  Secondary,
  Tertiary,
}

export enum TextStyles {
  Small = "text-[14px]",
  Regular = "text-[15px]",
  Large = "text-[16px]",
}
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

type ButtonAnchorProps =
  & React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
  & CommomButtonProps;

type ButtonLabelProps =
  & React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
  & CommomButtonProps;

type ButtonsProps = ButtonProps | ButtonAnchorProps | ButtonLabelProps;

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
  "disabled:bg-[#C5C5C5] disabled:border-[#C5C5C5] disabled:text-accent [&[disabled]]:bg-[#C5C5C5] [&[disabled]]:border-[#C5C5C5] [&[disabled]]:text-accent";

function makeFinalProps<T extends ButtonsProps>(
  props: T,
) {
  const {
    styleType = ButtonType.Primary,
    textStyles = TextStyles.Small,
    className,
    disableHover = false,
    class: moreClasses,
    ...rest
  } = props;
  const { common, hover, notHover } = typeClasses[styleType];
  const classNames = clx(
    "btn",
    common,
    disableHover ? notHover : hover,
    textStyles,
    "rounded-lg",
    disabledClasses,
    className?.toString(),
    moreClasses?.toString(),
  );

  return {
    ...rest,
    class: classNames,
  };
}

export default function Button(props: ButtonProps) {
  const finalProps = makeFinalProps(
    props,
  );
  return (
    <button
      {...finalProps}
    >
      {props.children}
    </button>
  );
}

export function ButtonAnchor(props: ButtonAnchorProps) {
  const finalProps = makeFinalProps(
    props,
  );
  return (
    <a
      {...finalProps}
    >
      {props.children}
    </a>
  );
}

export function ButtonLabel(props: ButtonLabelProps) {
  const finalProps = makeFinalProps(
    props,
  );
  return (
    <label
      {...finalProps}
    >
      {props.children}
    </label>
  );
}
