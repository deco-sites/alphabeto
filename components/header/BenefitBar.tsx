import type { HTMLWidget } from "apps/admin/widgets.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { IconArrowLeft } from "../Icons/IconArrowLeft.tsx";
import { IconArrowRight } from "../Icons/IconArrowRight.tsx";

export interface BenefitBarProps {
  benefits?: HTMLWidget[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

export function BenefitBar({ benefits = [], interval }: BenefitBarProps) {
  const id = useId();

  return (
    <div id={id} class="bg-base-200 h-[30px] items-center flex">
      <div class="flex items-center max-w-[854px] w-full justify-between mx-auto absolute left-[50%] -translate-x-1/2">
        <Slider.PrevButton
          className="bg-base-200 hidden desk:block"
          disabled={false}
        >
          <IconArrowLeft />
        </Slider.PrevButton>

        <Slider.NextButton
          class="bg-base-200 hidden desk:block"
          disabled={false}
        >
          <IconArrowRight />
        </Slider.NextButton>
      </div>

      <Slider class="carousel carousel-center w-screen gap-6 text-secondary-content text-sm/4">
        {benefits.map((benefits, index) => (
          <Slider.Item index={index} class="carousel-item">
            <span
              class="px-5 w-screen text-center font-bold text-xs"
              dangerouslySetInnerHTML={{ __html: benefits }}
            />
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS infinite rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default BenefitBar;
