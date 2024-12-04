import { ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";
import Slider from "site/components/ui/Slider.tsx";
import { LoadingFallbackProps } from "@deco/deco";

interface HomeToCategoryBannerItem {
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
  buttonText: string;
  buttonColor: string;
}

interface HomeToCategoryBannerProps {
  title: string;
  items: HomeToCategoryBannerItem[];
}

export default function HomeToCategoryBanner(
  { title, items }: HomeToCategoryBannerProps,
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
              <div className={"relative"}>
                <img
                  className={"rounded-lg"}
                  src={image.src}
                  alt={item.image.alt}
                  width={image.width}
                  height={image.height}
                />
                <a
                  style={{ background: item.buttonColor }}
                  className={"absolute top-[400px] w-full right-[20%] max-w-[243px] flex items-center justify-center rounded-full font-['BeccaPerry'] text-white desk:text-[40px] mobile:text-[28px] font-medium"}
                  href={item.categoryLink}
                >
                  {item.buttonText}
                </a>
              </div>
            </Slider.Item>
          );
        })}
      </Slider>
    </div>
  );
}

export const LoadingFallback = (
  props: LoadingFallbackProps<HomeToCategoryBannerProps>,
) => (
  // deno-lint-ignore no-explicit-any
  <HomeToCategoryBanner {...(props as any)} loading="lazy" />
);
