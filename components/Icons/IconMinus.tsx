interface Props {
  class?: string;
  strokeclass?: string;
  strokeWidth?: number;
}
export function IconMinus(
  { class: className, strokeclass, strokeWidth }: Props,
) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class={className}
    >
      <path
        d="M5 12H19"
        class={strokeclass}
        stroke-width={strokeWidth ?? "2"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
