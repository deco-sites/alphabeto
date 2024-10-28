interface Props {
  className?: string;
  strokeClassName?: string;
  strokeWidth?: number;
}
export function IconMinus({ className, strokeClassName, strokeWidth }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5 12H19"
        className={strokeClassName}
        stroke-width={strokeWidth ?? "2"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
