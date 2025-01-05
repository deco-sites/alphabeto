import type { RichText } from "apps/admin/widgets.ts";

/**@title {{ title }}*/
interface PolicyProps {
  /**@title Título*/
  title: string;

  /**@title Subtítulo */
  subtitle?: string;

  /**@title Texto */
  paragraph: RichText;
}

interface ItemsProps {
  items: PolicyProps[];
}

export default function TextContent(
  { items }: ItemsProps,
) {
  return (
    <div class="flex flex-col">
      {items.map((content, index) => (
        <div key={index} class="mb-[40px]">
          <section class="flex flex-col mb-[20px]">
            <p class="font-[beccaPerry] text-[44px] mobile:text-[32px] font-medium text-[#676767] mb-[20px]">
              {content.title}
            </p>
            <p
              class={`text-[20px] mobile:text-[14px] font-bold text-[#7E7F88] ${
                content.subtitle === undefined ? "mt-[-20px]" : "mt-[0px]"
              }`}
            >
              {content.subtitle}
            </p>
          </section>
          <section>
            <p
              class="font-regular text-[12px] text-[#ffffff]"
              dangerouslySetInnerHTML={{ __html: content.paragraph }}
            />
          </section>
        </div>
      ))}
    </div>
  );
}
