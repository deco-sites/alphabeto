import { Color, ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { clx } from "site/sdk/clx.ts";
import Section from "site/components/ui/Section.tsx";

interface HomeToCategoryBannerItem {
  /**@title Label for CMS */
  label: string;
  image: {
    mobile: {
      src: ImageWidget;
    };

    desktop: {
      src: ImageWidget;
    };

    alt: string;
  };
  categoryLink: string;
  buttonText: string;
  buttonColor: Color;
}

interface HomeToCategoryBannerProps {
  title: string;
  items: HomeToCategoryBannerItem[];
}

export default function HomeToCategoryBanner(
  { title, items }: HomeToCategoryBannerProps,
) {
  return (
    <div class="desk:mt-[100px] mt-[80px] w-full container">
      <h2 class="font-beccaPerry desk:text-[40px] desk:leading-[48px] text-[28px] leading-[33px] font-medium text-[#676767] text-center mb-10">
        {title}
      </h2>
      <div class="grid grid-cols-1 desk:grid-cols-3 gap-4">
        {items.map((item) => {
          return (
            <article class="max-w-[443px] rounded-lg">
              <a class="relative" href={item.categoryLink}>
                <Picture>
                  <Source
                    src={item.image.desktop.src}
                    width={443}
                    height={496}
                  />
                  <Source
                    src={item.image.mobile.src}
                    width={443}
                    height={496}
                  />
                  <img
                    src={item.image.desktop.src}
                    alt={item.image.alt}
                    class="rounded-lg"
                  />
                </Picture>
                <span
                  style={{ background: item.buttonColor }}
                  class={clx(
                    "absolute desk:bottom-10 mobile:bottom-[30px] desk:h-[58px] desk:w-[242px] w-[165px] h-[44px] flex items-center justify-center rounded-full font-beccaPerry",
                    "text-white left-1/2 -translate-x-1/2 desk:text-[40px] mobile:text-[28px] font-medium z-20",
                  )}
                >
                  {item.buttonText}
                </span>
                <div class="absolute w-full h-auto left-0 bottom-0 aspect-[335/178] desk:aspect-[443/278] bg-gradient-to-b from-[#14141400] to-[#141414] rounded-b-lg" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export const LoadingFallback = () => {
  const device = useDevice();
  const size = device === "desktop" ? 584 + 100 : 1044 + 80;
  return <Section.Placeholder height={size + "px"} />;
};
