import { Color, ImageWidget, RichText } from "apps/admin/widgets.ts";
import Slider from "site/components/ui/Slider.tsx";
import { useId } from "site/sdk/useId.ts";
import Section from "site/components/ui/Section.tsx";
import Image from "apps/website/components/Image.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

/** @titleBy title */
interface BenefitsBarItem {
  title: string;
  message: RichText;
  /** @title Principal Color Text */
  mainColor: Color;
  backgroundColor: Color;
  image: ImageWidget;
  imageAlt: string;
}

interface BenefitsBar {
  /** @maxItems 6 */
  items: BenefitsBarItem[];
  interval?: number;
}

function BenefitsBar({ items, interval }: BenefitsBar) {
  const id = useId();

  return (
    <div>
      <Slider
        style={{
          "--cols": items.length,
        }}
        class="desk:container grid justify-between grid-cols-[repeat(var(--cols),1fr)] pt-5 pb-[50px] gap-4 mobile:carousel mobile:max-w-[100dvw] mobile:carousel-center mobile:scroll-p-5"
      >
        {items.map((item, index) => (
          <Slider.Item
            index={index}
            class="w-fit mobile:first:pl-5 mobile:last:pr-5"
          >
            <article
              style={{
                "--bgColor": item.backgroundColor,
                "--mainColor": item.mainColor,
              }}
              class="mobile:min-w-[260px] mobile:max-w-[260px] desk:max-w-[213px] bg-[var(--bgColor)] flex border border-[var(--mainColor)] rounded-2xl border-dashed gap-3.5 desk:gap-1 h-full py-1.5 px-3.5 desk:px-1 items-center mobile:carousel-item mobile:box-border"
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                width={40}
                height={40}
              />
              <div>
                <h4 class="font-beccaPerry text-[16px] leading-[18px] text-[var(--mainColor)]">
                  {item.title}
                </h4>
                <p
                  class="text-[12px] [&>a]:text-[var(--mainColor)] [&>a:visted]:text-[var(--mainColor)] [&>a]:underline [&>a]:font-bold"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTMLCode(item.message, {
                      allowedTags: ["strong", "em", "u", "a"],
                      removeWrapperTag: true,
                    }),
                  }}
                />
              </div>
            </article>
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS infinite rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="140px" />;

export default BenefitsBar;
