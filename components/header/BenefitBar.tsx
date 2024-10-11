import Slider from "../../components/ui/Slider.tsx";
import type { HTMLWidget } from "apps/admin/widgets.ts";
import { useId } from "../../sdk/useId.ts";
import { IconArrowRight } from "../Icons/IconArrowRight.tsx";

export interface BenefitBarProps {
  benefits?: HTMLWidget[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

export function BenefitBar({ benefits = [], interval}: BenefitBarProps) {
  const id = useId();

  console.log({benefits})

  return (
    <div id={id}>
        <Slider.NextButton class="bg-base-200" disabled={false}>
        <IconArrowRight />
      </Slider.NextButton>
      <Slider class="carousel carousel-center w-screen gap-6 bg-secondary text-secondary-content text-sm/4">
        {benefits.map((benefits, index) => (
          <Slider.Item index={index} class="carousel-item">
            <span
              class="px-5 py-4 w-screen text-center"
              dangerouslySetInnerHTML={{ __html: benefits }}
            />
          </Slider.Item>
        ))}

      </Slider>
      <Slider.NextButton class="bg-base-200" disabled={false}>
        <IconArrowRight />
      </Slider.NextButton>

      <Slider.JS infinite rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default BenefitBar;