import { ImageWidget } from "apps/admin/widgets.ts";
import { Product } from "apps/commerce/types.ts";
import { ExportedColorItem } from "site/loaders/savedColors.ts";
import ProductSlider from "site/components/GiftShelf/ProductSlider.tsx";
import { useId } from "site/sdk/useId.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

interface GiftShelfProps {
  title: string;
  description: string;
  image: {
    desktopSrc: ImageWidget;
    mobileSrc: ImageWidget;
    alt?: string;
  };
  products: Product[] | null;
  colors: ExportedColorItem[];
}

export default function GiftShelf({
  title,
  description,
  image,
  products,
  colors,
}: GiftShelfProps) {
  const id = useId();
  if (!products) return null;
  return (
    <div class="flex flex-col container tablet-large:mt-[100px] mt-20">
      <span class="flex flex-col gap-4">
        <h2 class="font-beccaPerry text-[28px] leading-8 tablet-large:text-[40px] tablet-large:leading-[48px] font-medium text-[#676767]">
          {title}
        </h2>
        <p class="text-[#676767] text-base leading-5 tablet-large:leading-6 font-medium max-w-[224px] tablet-large:max-w-full">
          {description}
        </p>
      </span>
      <div class="tablet-large:grid grid-cols-[1fr_min(46.11dvw,_712px)] flex flex-col gap-4 mt-10">
        <Picture>
          <Source
            media="(max-width: 767px)"
            src={image.mobileSrc}
            width={672}
            height={688}
          />
          <Source
            media="(min-width: 768px)"
            src={image.desktopSrc}
            width={355}
            height={329}
          />
          <img
            src={image.desktopSrc}
            alt={image.alt}
            class="w-full tablet-large:aspect-[672/688] aspect-[355/329] rounded-lg object-cover"
          />
        </Picture>
        <ProductSlider id={id} products={products} colors={colors} />
      </div>
    </div>
  );
}
