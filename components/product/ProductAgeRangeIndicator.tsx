import { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";

interface Props {
  product: Product;
  class?: string;
}

export default function ProductAgeRangeIndicator(
  { product, class: className = "" }: Props,
) {
  const additionalProperties = product.isVariantOf?.additionalProperty ?? [];

  const ageRange =
    additionalProperties.find((property) =>
      property.name?.toLowerCase() === "badge faixa etária"
    )?.value ?? "Nenhuma Criança";

  if (!ageRange) {
    return null;
  }

  return (
    <span
      class={clx(
        "bg-secondary text-primary p-1.5 text-xs desk:text-sm font-bold rounded-lg w-fit mb-2.5",
        className,
      )}
    >
      {ageRange}
    </span>
  );
}
