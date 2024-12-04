import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

interface ImageData {
  mobile: ImageWidget;
  desktop: ImageWidget;
  /**
   * @title Alternative Text
   * @description The alternative text for people who can't see the image.
   */
  alt: string;
}

interface Props {
  text: RichText;
  image: ImageData;
}

const TITLE_STYLES =
  "desk:[&>h2]:text-[32px] desk:[&>h2]:leading-[38px] [&>h2]:text-[25px] [&>h2]:leading-[30px] [&>h2]:font-medium [&>h2]:text-[#676767] [&>h2]:font-beccaPerry [&>h2]:mb-6";
const PARAGRAPH_STYLES =
  "[&>p]:text-xs [&>p]:leading-[18px] [&>p]:text-[#7E7F88] [&>p:not(:last-child)]:mb-[60px]";

/** @title Category Bottom Banner */
export default function CategoryBottomBanner(props: Props) {
  return (
    <div class="bg-secondary-content relative">
      <div class="flex mobile:flex-col gap-20 desk:gap-[102px] container py-[30px] desk:py-14 justify-between  ">
        <div
          class={clx("max-w-[671px]", TITLE_STYLES, PARAGRAPH_STYLES)}
          dangerouslySetInnerHTML={{
            __html: sanitizeHTMLCode(props.text, {
              removeEmptyTags: true,
              allowedTags: [
                "p",
                "h2",
                "strong",
                "em",
                "b",
                "i",
                "a",
              ],
            }),
          }}
        />
        <Picture>
          <Source
            media="(max-width: 767px)"
            src={props.image.mobile}
            fetchPriority="auto"
            width={335}
            height={340}
          />
          <Source
            media="(min-width: 768px)"
            src={props.image.desktop}
            fetchPriority="auto"
            width={587}
            height={340}
          />
          <img
            src={props.image.mobile}
            alt={props.image.alt}
            className="w-full desk:min-w-[587px] rounded-lg"
          />
        </Picture>
      </div>
      <Icon
        id="stars-cat-1-desktop"
        width="21"
        height="47"
        class="absolute mobile:hidden left-0 top-0 text-[#F6D814]"
      />
      <Icon
        id="stars-cat-2-desktop"
        width="71"
        height="82"
        class="absolute mobile:hidden bottom-0 right-0 text-[#F6D814]"
      />
      <Icon
        id="stars-cat-1-mobile"
        width="35"
        height="53"
        class="absolute desk:hidden top-0 right-0 text-[#F6D814]"
      />
      <Icon
        id="stars-cat-2-mobile"
        width="66"
        height="94"
        class="absolute desk:hidden bottom-[339px] right-0 text-[#F6D814]"
      />
    </div>
  );
}
