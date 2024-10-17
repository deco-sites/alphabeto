import { ImageWidget } from "apps/admin/widgets.ts";
import { IconArrowMinicart } from "../Icons/IconArrowMinicart.tsx";

export interface MinicartEmptyItem {
  image: ImageWidget;
  label: string;
  href: string;
}

export interface MinicartEmptyProps {
  icon: ImageWidget;
  title: string;
  itemsTitle: string;
  items: MinicartEmptyItem[];
}

interface Props {
  content?: MinicartEmptyProps;
}

export function MinicartEmpty({ content }: Props) {
  return (
    <div class="relative h-full w-full flex justify-center">
      <div class="pt-[130px] flex items-center flex-col gap-5">
        {content?.icon && <img src={content.icon} alt="Sacola" />}
        <h4 class="font-['BeccaPerry'] text-[2rem] text-accent">{content?.title}</h4>
      </div>

      <div class="absolute bottom-[24px] rounded-lg w-[calc(100%-48px)] bg-secondary-content p-5">
        <h4 class="mb-[10px] font-bold text-base text-accent text-center">{content?.itemsTitle}</h4>

        {content?.items.map((item, i) => (
          <a href={item.href} class={`flex justify-between items-center py-[10px] ${i > 0 && "border-t-[1px] border-secondary border-dashed"}`}>
            <div class="flex gap-[10px] items-center">
              <img src={item.image} alt={item.label} />
              <label class="text-xs text-[#7E7F88] font-bold">{item.label}</label>
            </div>
            <IconArrowMinicart />
          </a>
        ))}
      </div>
    </div>
  );
}
