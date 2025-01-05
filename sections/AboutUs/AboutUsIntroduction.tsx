import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

interface Props {
  /*+
	* @title Logo
	* @description Imagem que está atras do Título
	*/
  logo: ImageWidget;
  /**
   * @title Descrição da Imagem
   * @description Descrição da imagem para pessoas com deficiência visual
   */
  altLogo: string;
  /**
   * @title Título
   * @description Título que aparece dentro da imagem
   */
  title: string;
  /** @title Parágrafo 1 */
  paragraphOne: RichText;
  /**	@title Parágrafo 2 */
  paragraphTwo: RichText;

  /** @title Imagem 1 */
  imageOne: {
    /**	@title Imagem Desktop */
    srcDesktop: ImageWidget;
    /**	@title Imagem Mobile */
    srcMobile: ImageWidget;
    /**
     * @title Descrição da Imagem
     * 	@description Descrição da imagem para pessoas com deficiência visual
     */
    alt: string;
  };
  /** @title Imagem 2 */
  imageTwo: {
    /**	@title Imagem Desktop */
    srcDesktop: ImageWidget;
    /**	@title Imagem Mobile */
    srcMobile: ImageWidget;
    /**
     * @title Descrição da Imagem
     * 	@description Descrição da imagem para pessoas com deficiência visual
     */
    alt: string;
  };
}

const COMMON_SANITIZATION_OPTIONS = {
  allowedTags: ["p", "strong", "em", "a", "br"],
  removeWrapperTag: true,
};

export default function AboutUsIntroduction(props: Props) {
  const { logo, title, altLogo } = props;
  return (
    <div>
      <div
        class={`h-auto w-full flex flex-col items-center mt-[40px] mobile:mt-[30px] mb-10 mobile:mb-[48.05px] relative`}
      >
        <Image
          class="mobile:w-[335px]"
          src={logo ?? ""}
          alt={altLogo}
          width={920}
          height={170}
        />
        <h2 class="font-beccaPerry absolute mobile:top-[32px] top-[77px] text-[44px] leading-[120%] mobile:text-[32px] text-accent">
          {title}
        </h2>
      </div>
      <article class="desk:container mobile:flex mobile:flex-col desk:grid desk:grid-cols-[1fr_453px] desk:mb-[145px] mb-5">
        <div class="mobile:container">
          <p
            class="text-sm text-[#7E7F88] max-w-[787px]"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTMLCode(
                props.paragraphOne,
                COMMON_SANITIZATION_OPTIONS,
              ),
            }}
          />
          <div class="grid grid-cols-[1fr_84px] desk:grid-cols-[162px_1fr] gap-2.5 mt-2 desk:mt-8">
            <Icon
              id="arrow-with-twirls"
              width="162"
              height="142"
              class="mobile:hidden"
            />
            <p
              class="text-sm text-[#7E7F88] mt-[34px]"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTMLCode(
                  props.paragraphTwo,
                  COMMON_SANITIZATION_OPTIONS,
                ),
              }}
            />
            <Icon
              class="desk:hidden"
              id="arrow-with-twirls-2"
              width="84"
              height="173"
            />
          </div>
        </div>
        <div class="relative mobile:overflow-x-hidden mobile:h-[449px] mobile:mx-auto">
          <Picture>
            <Source
              media="(min-width:768px)"
              src={props.imageOne.srcDesktop}
              width={476.5}
              height={476.5}
            />
            <Source
              media="(max-width:767px)"
              src={props.imageOne.srcMobile}
              width={375}
              height={375}
            />
            <img
              src={props.imageOne.srcDesktop}
              alt={props.imageOne.alt}
              class={clx(
                "desk:w-[476px] desk:h-[476px] desk:absolute desk:min-w-[476px] desk:top-[-40.12px]",
                "mobile:w-[375px] mobile:h-[375px]",
              )}
            />
          </Picture>
          <Picture>
            <Source
              media="(min-width:768px)"
              src={props.imageTwo.srcDesktop}
              width={340.83}
              height={340.83}
            />
            <Source
              media="(max-width:767px)"
              src={props.imageTwo.srcMobile}
              width={250}
              height={250}
            />
            <img
              src={props.imageTwo.srcDesktop}
              alt={props.imageTwo.alt}
              class={clx(
                "desk:absolute desk:left-[141px] desk:top-[163px]",
                "mobile:w-[250px] mobile:h-[250px] mobile:absolute mobile:left-[132px] mobile:top-[199px]",
              )}
            />
          </Picture>
        </div>
      </article>
    </div>
  );
}
