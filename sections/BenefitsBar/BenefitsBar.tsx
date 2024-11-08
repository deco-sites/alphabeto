import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { LoadingFallbackProps } from "@deco/deco";
import { BenefitBarProps } from "../../components/header/BenefitBar.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { useId } from "site/sdk/useId.ts";

interface BenefitsBarItem {
  mainColor: string;
  backgroundColor: string;
  image: ImageWidget;
  imageAlt: string;
  title: string;
  message: RichText;
}

interface BenefitsBar {
  /**
   * @maxItems 6
   */
  items: BenefitsBarItem[];
  interval?: number;
}

function BenefitsBar({ items, interval }: BenefitsBar) {
  const id = useId();

  return (
    <div>
      <Slider
        style={{
          gridTemplateColumns: `repeat(${items.length}, 213px)`,
        }}
        class="px-10 mt-5 grid gap-4 mb-[50px] carousel carousel-center w-screen"
      >
        {items.map((item, index) => (
          <Slider.Item
            index={index}
            style={{
              backgroundColor: item.backgroundColor,
              borderColor: item.mainColor,
            }}
            class={`border-dashed border rounded-2xl px-3 py-[6px] flex gap-[5px] items-center carousel-item`}
          >
            <img src={item.image} alt={item.imageAlt} />
            <div>
              <p style={{ color: item.mainColor }} class="font-['BeccaPerry']">
                {item.title}
              </p>
              <small
                class="text-[12px]"
                dangerouslySetInnerHTML={{
                  __html: item.message,
                }}
              />
            </div>
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS infinite rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export const LoadingFallback = (
  props: LoadingFallbackProps<BenefitBarProps>,
) => (
  // deno-lint-ignore no-explicit-any
  <BenefitsBar {...(props as any)} loading="lazy" />
);

export default BenefitsBar;
