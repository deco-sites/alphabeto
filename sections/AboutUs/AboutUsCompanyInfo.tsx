import { RichText } from "apps/admin/widgets.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { clx } from "site/sdk/clx.ts";

interface InfoItems {
  /**
   * @title Label
   * @description Label do item, aparece na listagem do CMS
   */
  label: string;
  /**@title Informação principal */
  mainInfo: string;
  /**
   * @title Cor da informação principal
   * @description Cor da informação principal
   * @format color
   */
  mainInfoColor: string;
  /**@title Texto sobre a informação */
  textAboutInfo: RichText;
}
interface Props {
  /**@title Título */
  title?: string;
  /**@title Subtítulo */
  subTitle?: string;
  /**@title Pontos de informação */
  items?: InfoItems[];
  /**@title Texto geral */
  text?: RichText;
}

export default function AboutUsCompanyInfo(props: Props) {
  const { title, subTitle, items, text } = props;
  return (
    <div class="flex flex-col items-center justify-center text-center container my-20 desk:my-[100px]">
      <div class="mb-10 desk:mb-[50px]">
        <h3 class="font-beccaPerry font-medium text-[40px] leading-[48px] mobile:text-[28px] mobile:leading-8 text-[#676767] mb-[20px]">
          {title}
        </h3>
        <h4 class="font-bold text-[13px] leading-[18px] desk:text-[14px] desk:leading-5 text-[#676767]">
          {subTitle}
        </h4>
      </div>
      <div class="flex flex-row mobile:flex-col items-center justify-center w-full container mb-10 desk:mb-[50px]">
        {items?.map((item, index) => (
          <>
            <div class="flex flex-col items-center text-center">
              <p
                class="font-bold text-[20px] leading-6 desk:text-[28px] desk:leading-8 mb-1"
                style={{
                  color: item.mainInfoColor,
                }}
              >
                {item.mainInfo}
              </p>
              <p
                class="text-[12px] desk:text-[13px] leading-[18px] min-w-[142px] text-center text-[#676767]"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTMLCode(item.textAboutInfo, {
                    removeWrapperTag: true,
                    allowedTags: ["br"],
                  }),
                }}
              />
            </div>
            {(index < items.length - 1)
              ? (
                <div class="w-[162px] h-[1px] mobile:my-5 desk:w-[1px] desk:h-[67px] desk:mx-[35px] bg-[#F7E0BF]" />
              )
              : null}
          </>
        ))}
      </div>
      <div
        class={clx(
          "text-[#676767] leading-5 text-[14px] mobile:text-[12px] mobile:leading-[18px]",
          "desk:[&>ul]:list-inside [&>ul]:text-center mobile:[&>ul]:text-left [&>ul>li>p]:inline [&>ul]:list-disc mobile:[&>ul]:ml-[15px]",
        )}
        dangerouslySetInnerHTML={{
          __html: text ?? "",
        }}
      />
    </div>
  );
}
