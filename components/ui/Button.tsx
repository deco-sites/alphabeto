import { clx } from "../../sdk/clx.ts";

export enum ButtonType {
  Primary = "btn-primary hover:bg-secondary hover:text-primary hover:border-secondary",
  Secondary = "btn-secondary text-primary hover:bg-primary hover:text-white",
  Tertiary = "btn-primary btn-outline bg-white hover:bg-primary hover:text-white",
}

const disabledClasses = "disabled:bg-[#C5C5C5] disabled:border-[#C5C5C5] disabled:text-[#676767] [&[disabled]]:bg-[#C5C5C5] [&[disabled]]:border-[#C5C5C5] [&[disabled]]:text-[#676767]";

export enum TextStyles {
  Small = "text-[14px]",
  Regular = "text-[15px]",
  Large = "text-[16px]",
}

const makeFinalClass = (styleType: ButtonType, textStyles: TextStyles, classNames: string) => {
  return clx("btn", styleType, textStyles, "rounded-lg", disabledClasses, classNames);
};

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  styleType?: ButtonType;
  textStyles?: TextStyles;
};

export default function Button(props: ButtonProps) {
  const { styleType = ButtonType.Primary, className, children, textStyles = TextStyles.Small, ...rest } = props;
  return (
    <button className={makeFinalClass(styleType, textStyles, className?.toString() ?? "")} {...rest}>
      {children}
    </button>
  );
}

type ButtonAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
  styleType?: ButtonType;
  textStyles?: TextStyles;
};

export function ButtonAnchor(props: ButtonAnchorProps) {
  const { styleType = ButtonType.Primary, className, children, textStyles = TextStyles.Small, ...rest } = props;
  return (
    <a className={makeFinalClass(styleType, textStyles, className?.toString() ?? "")} {...rest}>
      {children}
    </a>
  );
}

type ButtonLabelProps = React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & {
  styleType?: ButtonType;
  textStyles?: TextStyles;
};

export function ButtonLabel(props: ButtonLabelProps) {
  const { styleType = ButtonType.Primary, className, children, textStyles = TextStyles.Small, ...rest } = props;
  return (
    <label className={makeFinalClass(styleType, textStyles, className?.toString() ?? "")} {...rest}>
      {children}
    </label>
  );
}
