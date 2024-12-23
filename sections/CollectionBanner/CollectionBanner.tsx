import { ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";
import Slider from "site/components/ui/Slider.tsx";
import { LoadingFallbackProps } from "@deco/deco";

interface CollectionBannerItem {
  image: {
    mobile?: {
      src?: ImageWidget;
      width?: number;
      height?: number;
    };

    desktop: {
      src: ImageWidget;
      width?: number;
      height?: number;
    };

    alt: string;
  };
  categoryLink: string;
}

interface CollectionBannerProps {
  title: string;
  items: CollectionBannerItem[];
}

export default function CollectionBanner(
  { title, items }: CollectionBannerProps,
) {
  const device = useDevice();
  const isDesktop = device === "desktop";

  return (
    <div className={"desk:px-10 mt-[100px] mobile:px-4 w-full container"}>
      <h2
        className={"font-['BeccaPerry'] text-[40px] leading-[48px] font-medium text-[#676767] text-center mb-10"}
      >
        {title}
      </h2>
      <Slider
        className={"flex justify-between gap-4 max-w-full carousel carousel-center overflow-scroll"}
      >
        {items.map((item, index) => {
          const image = isDesktop || !item.image.mobile?.src
            ? item.image.desktop
            : item.image.mobile;

          return (
            <Slider.Item
              index={index}
              className={"min-w-[335px] carousel-item"}
            >
              <a href={item.categoryLink}>
                <img
                  className={"rounded-lg"}
                  src={image.src}
                  alt={item.image.alt}
                  width={image.width}
                  height={image.height}
                />
              </a>
            </Slider.Item>
          );
        })}
      </Slider>
    </div>
  );
}

export const LoadingFallback = (
  props: LoadingFallbackProps<CollectionBannerProps>,
) => (
  // deno-lint-ignore no-explicit-any
  <CollectionBanner {...(props as any)} loading="lazy" />
);
