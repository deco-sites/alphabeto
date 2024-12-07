import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { COMMON_HTML_TAGS_TO_ALLOW } from "site/constants.ts";
import { ButtonAnchor } from "site/components/ui/Button.tsx";

interface Props {
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

export default function BackgroundBanner(props: Props) {
  return (
    <article class="relative">
      <Picture>
        <Source
          media="(max-width: 1024px)"
          src={props.image.mobile.src}
          width={props.image.mobile.width}
          height={props.image.mobile.height}
        />
        <Source
          media="(min-width: 1024px)"
          src={props.image.desktop.src}
          width={props.image.desktop.width}
          height={props.image.desktop.height}
        />
        <img
          src={props.image.desktop.src}
          alt={props.image.alt}
          class="w-full object-cover mobile:min-h-[545px]"
        />
      </Picture>
      <div class="absolute desk:top-1/2 desk:left-10 desk:-translate-y-1/2 text-white z-10 desk:max-w-[480px] desk:py-10 top-5 mobile:px-5">
        {props.text ? (
          <div
            class="[&>h2]:font-beccaPerry [&>h2]:text-[40px] [&>h2]:leading-[48px] [&>p]:text-sm [&>p]:pt-5"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTMLCode(props.text, {
                allowedTags: [...COMMON_HTML_TAGS_TO_ALLOW, "h2"],
                removeWrapperTag: false,
                removeAttributes: true,
                removeEmptyTags: true,
              }),
            }}
          />
        ) : null}
        {props.cta ? (
          <ButtonAnchor class="w-[252px] mt-5" href={props.cta.url}>
            {props.cta.label}
          </ButtonAnchor>
        ) : null}
      </div>
    </article>
  );
}
