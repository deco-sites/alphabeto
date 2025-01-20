import { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";

interface Props {
  product: Product;
  class?: string;
}

// This component is responsible for rendering the age range of a product.
// First is used the product specifications to get the age range, if it's not found
// then it tries to get the age range from the product name.

export default function ProductAgeRangeIndicator(
  { product, class: className = "" }: Props,
) {
  const name = product.isVariantOf?.name ?? product.name;
  const ageRangeFromNameNotValidated = name?.split("-").map((item) =>
    item.trim()
  ).at(-2);
  const ageRangeFromName =
    ageRangeFromNameNotValidated?.toLowerCase().includes("anos") ||
      ageRangeFromNameNotValidated?.toLowerCase().includes("meses")
      ? ageRangeFromNameNotValidated
      : null;
  const additionalProperties = product.isVariantOf?.additionalProperty ?? [];

  const ageRangeFromProperties = additionalProperties.find((property) =>
    property.name?.toLowerCase() === "badge faixa etária"
  )?.value;
  const ageRange = ageRangeFromProperties || ageRangeFromName;

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
