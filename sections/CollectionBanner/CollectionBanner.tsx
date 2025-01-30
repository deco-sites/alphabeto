import { useDevice } from "@deco/deco/hooks";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useId } from "preact/hooks";
import { SendEventOnClick } from "site/components/Analytics.tsx";
import Section from "site/components/ui/Section.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { clx } from "site/sdk/clx.ts";

interface CollectionBannerItem {
  /**@title Label for CMS */
  label: string;
  categoryLink: string;
  image: {
    mobile: {
      src: ImageWidget;
    };
    desktop: {
      src: ImageWidget;
    };
    alt: string;
  };
}

interface CollectionBannerProps {
  title: string;
  items: CollectionBannerItem[];
}

function CollectionBannerDesktop(props: CollectionBannerProps) {
  const device = useDevice();

  return (
    <div class="container mt-[100px]">
      <h2 class="font-beccaPerry text-[40px] leading-[48px] font-medium text-accent text-center mb-10">
        {props.title}
      </h2>
      <div class="grid grid-cols-3 gap-4">
        {props.items.map((item) => {
          const id = useId();

          return (
            <>
              <article id={id}>
                <a href={item.categoryLink}>
                  <Image
                    src={item.image.desktop.src}
                    alt={item.image.alt}
                    width={443}
                    height={320}
                    class="rounded-lg"
                  />
                </a>
              </article>

              <SendEventOnClick
                id={id}
                event={{
                  name: "mini_banner_click",
                  params: {
                    url: item.categoryLink,
                    device,
                  },
                }}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}

function CollectionBannerMobile(
  { title, items }: CollectionBannerProps,
) {
  const device = useDevice();
  const id = useId();

  return (
    <div class="mt-[80px] container" id={id}>
      <h2 class="font-beccaPerry text-[28px] leading-[33px] font-medium text-accent text-center mb-10">
        {title}
      </h2>

      <Slider class="flex justify-between gap-4 max-w-full carousel carousel-center overflow-scroll">
        {items.map((item, index) => {
          const itemID = useId();

          return (
            <>
              <Slider.Item
                index={index}
                class="min-w-[335px] carousel-item"
                id={itemID}
              >
                <a href={item.categoryLink}>
                  <Image
                    class="rounded-lg w-[calc(100vw-40px)]"
                    src={item.image.mobile.src}
                    alt={item.image.alt}
                    width={335}
                    height={240}
                  />
                </a>
              </Slider.Item>

              <SendEventOnClick
                id={itemID}
                event={{
                  name: "mini_banner_click",
                  params: {
                    url: item.categoryLink,
                    device,
                  },
                }}
              />
            </>
          );
        })}
      </Slider>

      <ul class="carousel w-full gap-1 justify-center mt-10">
        {items.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot
              index={index}
              class={clx(
                "bg-secondary h-[8px] w-[8px] no-animation rounded-full",
                "disabled:w-[30px] disabled:bg-primary transition-[width]",
              )}
            >
            </Slider.Dot>
          </li>
        ))}
      </ul>

      <Slider.JS rootId={id} />
    </div>
  );
}

export default function CollectionBanner(props: CollectionBannerProps) {
  const device = useDevice();
  const isDesktop = device === "desktop";
  if (isDesktop) return <CollectionBannerDesktop {...props} />;
  else return <CollectionBannerMobile {...props} />;
}

export function LoadingFallback() {
  const device = useDevice();
  const size = device === "desktop" ? 408 + 100 : 362 + 80;
  return <Section.Placeholder height={size + "px"} />;
}
