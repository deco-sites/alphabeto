import { ProductDetailsPage } from "apps/commerce/types.ts";
import { RotativeTextContent } from "site/sections/Content/RotativeText.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props): RotativeTextContent {
  const text = page?.product.isVariantOf?.additionalProperty.find(
    (property) => property.name === "Barra Rotativa",
  )?.value;
  if (!text) return null;
  return text;
}
