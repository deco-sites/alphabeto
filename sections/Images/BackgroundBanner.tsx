import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { ButtonAnchor } from "site/components/ui/Button.tsx";
import { COMMON_HTML_TAGS_TO_ALLOW } from "site/constants.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";

export interface BackgroundBannerData {
  text?: RichText;
  cta?: {
    label: string;
    url: string;
  };
  image: {
    desktop: {
      src: ImageWidget;
      width: number;
      height: number;
    };
    mobile: {
      src: ImageWidget;
      width: number;
      height: number;
    };
    /**
     * @title Alternative text
     * @description Alternative text for the image used for accessibility
     */
    alt: string;
  };
}

interface Props {
  data: BackgroundBannerData | null;
  addSpaceBefore?: boolean;
}

export default function BackgroundBanner(props: Props) {
  if (!props.data) return null;
  const { text, cta, image } = props.data;
  return (
    <>
      {props.addSpaceBefore ? <Spacer /> : null}
      <article class="relative">
        <Picture>
          <Source
            media="(max-width: 1024px)"
            src={image.mobile.src}
            width={image.mobile.width}
            height={image.mobile.height}
          />
          <Source
            media="(min-width: 1024px)"
            src={image.desktop.src}
            width={image.desktop.width}
            height={image.desktop.height}
          />
          <img
            src={image.desktop.src}
            alt={image.alt}
            class="w-full object-cover mobile:min-h-[545px]"
          />
        </Picture>
        <div class="absolute desk:top-1/2 desk:left-10 desk:-translate-y-1/2 text-white z-10 desk:max-w-[480px] desk:py-10 top-5 mobile:px-5">
          {text
            ? (
              <div
                class="[&>h2]:font-beccaPerry [&>h2]:text-[40px] [&>h2]:leading-[48px] [&>p]:text-sm [&>p]:pt-5"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTMLCode(text, {
                    allowedTags: [...COMMON_HTML_TAGS_TO_ALLOW, "h2"],
                    removeWrapperTag: false,
                    removeAttributes: true,
                    removeEmptyTags: true,
                  }),
                }}
              />
            )
            : null}
          {cta
            ? (
              <ButtonAnchor class="w-[252px] mt-5" href={cta.url}>
                {cta.label}
              </ButtonAnchor>
            )
            : null}
        </div>
      </article>
    </>
  );
}
