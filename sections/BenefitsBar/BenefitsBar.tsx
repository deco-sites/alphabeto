import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { LoadingFallbackProps } from "@deco/deco";
import { BenefitBarProps } from "../../components/header/BenefitBar.tsx";

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
}

function BenefitsBar({ items }: BenefitsBar) {
  return (
    <ul
      style={{
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
      }}
      class="px-10 mt-5 grid gap-4"
    >
      {items.map((item) => (
        <li
          style={{
            backgroundColor: item.backgroundColor,
            borderColor: item.mainColor,
          }}
          class={`border-dashed border rounded-2xl px-3 py-[6px] flex gap-[5px] items-center`}
        >
          <img src={item.image} alt={item.imageAlt} />
          <div>
            <p style={{ color: item.mainColor }} class="font-['BeccaPerry']">
              {item.title}
            </p>
            <small
              class="text-[12px]"
              dangerouslySetInnerHTML={{
                __html: item.message
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export const LoadingFallback = (
  props: LoadingFallbackProps<BenefitBarProps>
) => (
  // deno-lint-ignore no-explicit-any
  <BenefitsBar {...(props as any)} loading="lazy" />
);

export default BenefitsBar;
