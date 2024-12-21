import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";

interface Props {
  averageRating: number;
  maxRating: number;
  iconSize: number;
  class: string;
}
export default function ProductRating({
  averageRating,
  maxRating,
  class: className,
}: Props) {
  return (
    <div class={clx("flex", className)}>
      {Array.from({ length: maxRating }, (_, index) => (
        <Icon
          id="product_rating_star"
          class={clx(
            index < averageRating ? "text-[#FFF61E]" : "text-[#C5C5C5]",
          )}
          size={16}
        />
      ))}
    </div>
  );
}
