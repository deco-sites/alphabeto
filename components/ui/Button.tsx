import { clx } from "../../sdk/clx.ts";

export enum ButtonType {
  Primary =
    "btn-primary hover:bg-secondary hover:text-primary hover:border-secondary",
  Secondary = "btn-secondary text-primary hover:bg-primary hover:text-white",
  Tertiary =
    "btn-primary btn-outline bg-white hover:bg-primary hover:text-white",
}

export enum TextStyles {
  Small = "text-[14px]",
  Regular = "text-[15px]",
  Large = "text-[16px]",
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  styleType?: ButtonType;
  textStyles?: TextStyles;
};

export default function Button(props: ButtonProps) {
  const {
    styleType = ButtonType.Primary,
    className,
    children,
    textStyles = TextStyles.Small,
    ...rest
  } = props;
  return (
    <button
      className={clx(
        "btn",
        styleType,
        textStyles,
        "rounded-lg",
        className ?? "",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

type ButtonAnchorProps = JSX.IntrinsicElements["a"] & {
  styleType?: ButtonType;
  textStyles?: TextStyles;
};

export function ButtonAnchor(props: ButtonAnchorProps) {
  const {
    styleType = ButtonType.Primary,
    className,
    children,
    textStyles = TextStyles.Small,
    ...rest
  } = props;
  return (
    <a
      className={clx(
        "btn",
        styleType,
        textStyles,
        "rounded-lg",
        className ?? "",
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
