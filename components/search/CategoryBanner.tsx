import { useDevice } from "@deco/deco/hooks";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { COMMON_HTML_TAGS_TO_ALLOW } from "site/constants.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

export interface Props {
  /**
   * @description The title in cursive letters that appears below the subtitle
   */
  title?: string;
  /**
   * @description The subtitle that appears above the title
   */
  subtitle?: string;
  /**
   * @description The description that appears below the title
   */
  description?: RichText;
  /**
   * @description The image that appears in the background
   */
  image?: {
    /**
     * @description The image that appears in the background on mobile
     */
    mobile?: {
      src?: ImageWidget;
      width?: number;
      height?: number;
    };
    /**
     * @description The image that appears in the background on desktop
     */
    desktop?: {
      src?: ImageWidget;
      width?: number;
      height?: number;
    };
    /**
     * @description Text for visually impaired people
     */
    alt?: string;
  };
}
const DEFAULT_SIZES = {
  desktop: {
    width: 1360,
    height: 230,
  },
  mobile: {
    width: 335,
    height: 200,
  },
};

export default function CategoryBanner(props: Props) {
  const device = useDevice();
  const deviceFacade = device === "desktop" ? "desktop" : "mobile";
  const image = deviceFacade === "desktop"
    ? props.image?.desktop
    : props.image?.mobile;

  if (!image?.src) return null;

  return (
    <article class="relative mb-5">
      <Image
        class="w-full h-auto rounded-lg min-h-[200px] desk:min-h-[230px] object-cover"
        src={image.src}
        width={image.width || DEFAULT_SIZES[deviceFacade].width}
        height={image.height || DEFAULT_SIZES[deviceFacade].height}
        alt={props.image?.alt}
      />
      <div class="absolute top-1/2 -translate-y-1/2 text-base-100 max-w-[215px] desk:max-w-[377px] left-[14px] desk:left-[19.338%]">
        {props.subtitle && (
          <h2 class="uppercase text-sm font-bold mb-1">
            {props.subtitle}
          </h2>
        )}
        {props.title && (
          <h1 class="font-beccaPerry text-[32px] leading-[38.4px] desk:text-[44px] desk:leading-[52.8px] font-medium mb-4 desk:mb-5">
            {props.title}
          </h1>
        )}
        {props.description && (
          <p
            class="desk:text-sm text-[13px]"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTMLCode(props.description, {
                allowedTags: [...COMMON_HTML_TAGS_TO_ALLOW, "h2"],
                removeAttributes: true,
                removeWrapperTag: true,
              }),
            }}
          />
        )}
      </div>
    </article>
  );
}
