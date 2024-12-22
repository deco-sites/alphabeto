import { ProductDetailsPage } from "apps/commerce/types.ts";
import { BackgroundBannerData } from "site/sections/Images/BackgroundBanner.tsx";

export interface Props {
  page: ProductDetailsPage | null;
}

export default function loader(props: Props): BackgroundBannerData | null {
  const properties = props.page?.product?.isVariantOf?.additionalProperty ?? [];
  const desktopImage = properties.find((property) =>
    property.name === "Banner - Imagem Desktop"
  )?.value;
  const mobileImage = properties.find((property) =>
    property.name === "Banner - Imagem Mobile"
  )?.value;
  const alternativeText = properties.find((property) =>
    property.name === "Banner - Imagem Texto Alternativo"
  )?.value;
  if (!desktopImage || !mobileImage) return null;
  const title = properties.find((property) =>
    property.name === "Banner - Titulo"
  )?.value;
  const description = properties.find((property) =>
    property.name === "Banner - Descrição"
  )?.value;
  const ctaLabel = properties.find((property) =>
    property.name === "Banner - CTA Texto"
  )?.value;
  const ctaUrl = properties.find((property) =>
    property.name === "Banner - CTA Link"
  )?.value;
  let text: string | undefined = undefined;

  if (title) text = `<h2>${title}</h2>`;
  if (description && text) text += `<p>${description}</p>`;
  else if (description) text = `<p>${description}</p>`;
  const cta = ctaLabel && ctaUrl ? { label: ctaLabel, url: ctaUrl } : undefined;

  const image = {
    desktop: {
      src: desktopImage,
      width: 1440,
      height: 443,
    },
    mobile: {
      src: mobileImage,
      width: 375,
      height: 568,
    },
    alt: alternativeText || "",
  };

  return {
    image,
    text,
    cta,
  };
}
