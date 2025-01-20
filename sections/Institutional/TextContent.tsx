import type { RichText } from "apps/admin/widgets.ts";
import { clx } from "site/sdk/clx.ts";

/**@title {{ subtitle }}*/
interface PolicyProps {
  /**@title Título*/
  title?: string;

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
      {items.map((content) => (
        <div key={content.subtitle || content.title} class="mb-10">
          <div class="flex flex-col">
            {content.title
              ? (
                <h1 class="font-[beccaPerry] text-[44px] mobile:text-[32px] font-medium text-accent mb-2.5">
                  {content.title}
                </h1>
              )
              : null}
            {content.subtitle
              ? (
                <h2
                  class={`text-[20px] mobile:text-[14px] font-bold text-[#7E7F88] mb-5`}
                >
                  {content.subtitle}
                </h2>
              )
              : null}
          </div>
          <div>
            <div
              class={clx(
                "font-regular [&_a]:text-primary [&_a]:underline [&_a]:font-bold [&_ul]:list-disc [&_ul]:ml-[18px] [&_p]:text-[14px] mobile:[&_p]:text-[13px]",
                "[&_*]:text-[#7E7F88] [&_a_strong]:text-primary [&_td]:border [&_td]:border-[#7e7f88] [&_td]:border-solid [&_td]:p-2",
                "[&_th]:border [&_th]:border-[#7e7f88] [&_th]:border-solid [&_th]:p-2",
              )}
              dangerouslySetInnerHTML={{ __html: content.paragraph }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
