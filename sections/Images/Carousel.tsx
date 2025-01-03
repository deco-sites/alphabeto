import type { ImageWidget } from "apps/admin/widgets.ts";
import * as PictureTsx from "apps/website/components/Picture.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";

/**
 * @titleBy title
 */
export interface Banner {
  /** @description Title of the banner used to identify in the cms	*/
  title: string;
  /** @description desktop otimized image */
  desktop: ImageWidget;

  /** @description mobile otimized image */
  mobile: ImageWidget;

  /** @description Image's alt text */
  alt: string;

  /** @description Action to be performed when the banner is clicked */
  clickUrl: string;
}

export interface Props {
  images?: Banner[];

  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, mobile, desktop, clickUrl } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      {...selectPromotionEvent}
      href={clickUrl ?? "#"}
      aria-label={alt}
      class="relative w-full h-fit"
    >
      <PictureTsx.Picture preload={lcp} {...viewPromotionEvent}>
        <PictureTsx.Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={375}
          height={350}
        />
        <PictureTsx.Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1440}
          height={450}
        />
        <img
          class="w-full"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </PictureTsx.Picture>
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class="w-full relative"
    >
      <div class="relative z-10 aspect-[750/700] tablet-large:aspect-[2880/900] max-h-fit">
        <Slider class="carousel carousel-center w-full aspect-[750/700] tablet-large:aspect-[2880/900]">
          {images.map((image, index) => (
            <Slider.Item index={index} class="carousel-item w-full h-fit">
              <BannerItem image={image} lcp={index === 0 && preload} />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      <div class="absolute mobile:hidden left-10 top-1/2 -translate-y-1/2 z-20">
        <Slider.PrevButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group"
          disabled={false}
        >
          <Icon id="chevron-right" class="rotate-180 group-hover:hidden" />
          <Icon
            id="arrow-right"
            class="rotate-180 hidden group-hover:block"
          />
        </Slider.PrevButton>
      </div>

      <div class="absolute mobile:hidden right-10 top-1/2 -translate-y-1/2 z-20">
        <Slider.NextButton
          class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group"
          disabled={false}
        >
          <Icon id="chevron-right" class="group-hover:hidden" />
          <Icon
            id="arrow-right"
            class="hidden group-hover:block"
          />
        </Slider.NextButton>
      </div>

      <ul class="carousel absolute w-full z-20 gap-1 bottom-2.5 justify-center">
        {images.map((_, index) => (
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

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
