import Icon from "site/components/ui/Icon.tsx";
import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

import Image from "apps/website/components/Image.tsx";
import { Picture, Source } from "apps/website/components/Picture.tsx";

/**@title Imagems */
interface ImageProps {
  /**@title Primeira Imagem da primeira seção */
  firstImage?: ImageWidget;
  /**@title Texto alternativo */
  altFirstImage?: string;
  /**@title Segunda Imagem da primeira seção */
  secondFirstImage?: ImageWidget;
  /**@title Texto alternativo */
  altSecondFirstImage?: string;
  /**@title Segunda Imagem da segunda seção */
  secondImage?: ImageWidget;
  /**@title Texto alternativo */
  altSecondImage?: string;
}

/**@title Vídeos */
interface VideoProps {
  /**@title Título da seção de vídeo */
  videoTitle: string;
  /**@title Texto da seção de vídeo */
  videoText: RichText;
  /**@title URL do Vídeo */
  video: string;
}

/**@title Informação */
interface InfoItemsProps {
  /**@title Informação principal */
  mainInfo: RichText;
  /**@title Texto sobre a informação */
  textAboutInfo: string;
}

/**@title {{ alt }} */
interface AdditionalInfoImages {
  image: ImageWidget;
  alt: string;
}

/**@title Informações adicionais */
interface AdditionalInfo {
  title?: string;
  subtitle?: RichText;
  image: AdditionalInfoImages[];
}

/**@title Informações sobre a empresa */
interface CompanyProps {
  /**@title Título */
  title?: string;
  /**@title Subtítulo */
  subTitle?: string;
  /**@title Pontos de informação */
  items?: InfoItemsProps[];
  /**@title Texto geral */
  text?: RichText;
}

/**@title Parágrafos */
interface Item {
  /**@title Primeiro Parágrafo */
  firstText?: RichText;
  /**@title Segundo Parágrafo */
  secondText?: RichText;
  images?: ImageProps;
  video?: VideoProps;
}

/**@title Conteúdo */
interface Props {
  /**@title Banner principal */
  bannerDesktop?: ImageWidget;
  /**@title Banner principal Mobile */
  bannerMobile?: ImageWidget;
  /**@title Texto alternativo Banner*/
  altBanner?: string;
  /**@title Título da página */
  title?: string;
  /**@title Logo */
  logo?: ImageWidget;
  /**@title Texto alternativo Logo*/
  altLogo: string;
  /**@title Paragráfos */
  items: Item[];
  /**@title Sobre a empresa */
  company: CompanyProps;
  /**@title Informação adicional */
  additionalInfo: AdditionalInfo;
}

export default function AboutUs(
  {
    items,
    company,
    additionalInfo,
    title,
    logo,
    altLogo,
    bannerDesktop,
    bannerMobile,
    altBanner,
  }: Props,
) {
  return (
    <>
      <div class="flex justify-center w-full">
        <Picture>
          <Source
            class="hidden tablet:flex"
            media="(min-width: 768px)"
            src={bannerDesktop ? bannerDesktop : ""}
            width={1440}
            height={230}
          />

          <Source
            class="flex tablet:hidden"
            media="(max-width: 768px)"
            src={bannerMobile ? bannerMobile : ""}
            width={375}
            height={230}
          />

          <img
            src={bannerDesktop}
            alt={altBanner}
          />
        </Picture>
      </div>
      <div
        class={`h-64 mobile:h-[120px] w-full flex flex-col items-center mt-[40px]`}
      >
        <Image
          class="mobile:w-[335px]"
          src={logo ? logo : ""}
          alt={altLogo}
          width={920}
          height={170}
        />
        <h2 class="font-beccaPerry absolute mobile:mt-[32px] mt-[64px] text-[44px] mobile:text-[32px] text-[#676767]">
          {title}
        </h2>
      </div>

      {items.map((items, index) => (
        <div key={index} class="container">
          <div class="flex mobile:flex-col items-center">
            <div class="font-regular text-[12px] text-[#7E7F88] max-w-[787px] mobile:max-w-[100%] h-[100%]">
              <p
                dangerouslySetInnerHTML={{
                  __html: items.firstText ? items.firstText : "",
                }}
              />
            </div>

            <div class="relative w-[100%] h-[100%] z-5">
              <Icon
                id="star"
                width="47"
                height="50"
                class="absolute mt-[60px] right-[350px] z-10 hidden tablet:flex desk-small:hidden"
              />
              <Image
                class="absolute z-5 top-[-100px] right-0 w-[389px] hidden tablet:flex desk-small:hidden"
                src={items.images?.firstImage ? items.images?.firstImage : ""}
                alt={items.images?.altFirstImage}
                width={389}
                height={417}
              />
              <Image
                class="absolute mt-[100px] z-5 top-0 right-[-40px] w-[320px] hidden tablet:flex desk-small:hidden"
                src={items.images?.secondFirstImage
                  ? items.images?.secondFirstImage
                  : ""}
                alt={items.images?.altSecondFirstImage}
                width={320}
                height={256}
              />
            </div>
          </div>
          <div class="relative flex items-center desk-small:mb-[45%] desk-small:pb-[45%] pb-0 mb-0">
            <Image
              class="mobile:absolute mobile:top-[20px] mobile:scale-x-[-1] mobile:right-[0px] mobile:w-[108px] mobile:rotate-[-30deg]"
              src={items.images?.secondImage ? items.images?.secondImage : ""}
              alt={items.images?.altSecondImage}
              width={100}
              height={120}
            />
            <div class="font-regular text-[12px] text-[#7E7F88] max-w-[700px] mobile:max-w-[70%] mt-[65px]">
              <p
                dangerouslySetInnerHTML={{
                  __html: items.secondText ? items.secondText : "",
                }}
              />
              <Icon
                id="star"
                width="47"
                height="50"
                class="absolute mt-[60px] top-[340px] right-[30px] z-10 flex tablet:hidden tablet:top-[140px] tablet:right-[170px] desk-small:flex"
              />
              <Image
                class="absolute z-5 top-[390px] right-[20px] w-[300px] flex tablet:hidden tablet:top-[190px] tablet:right-[160px] desk-small:flex"
                src={items.images?.firstImage ? items.images?.firstImage : ""}
                alt={items.images?.altFirstImage}
                width={300}
                height={328}
              />
              <Image
                class="absolute mt-[100px] z-5 top-[440px] right-0 w-[200px] flex tablet:hidden tablet:top-[240px] tablet:right-[140px] desk-small:flex"
                src={items.images?.secondFirstImage
                  ? items.images?.secondFirstImage
                  : ""}
                alt={items.images?.altSecondFirstImage}
                width={200}
                height={190}
              />
            </div>
          </div>
        </div>
      ))}

      {items.map((items) =>
        items.video && (
          <div class="relative flex mobile:flex-col-reverse justify-around items-center bg-[#F7E0BF] mt-[144px] w-full">
            <Icon
              id="star"
              width="47"
              height="50"
              class="absolute top-[35px] left-[20px] z-10"
            />
            <Icon
              id="minor-star"
              width="28"
              height="30"
              class="absolute top-[20px] left-[55px] z-10"
            />
            <Icon
              id="star"
              width="47"
              height="50"
              class="absolute bottom-[35px] right-[20px] z-10"
            />
            <Icon
              id="minor-star"
              width="28"
              height="30"
              class="absolute bottom-[70px] right-[55px] z-10"
            />
            <iframe
              class="w-[626px] mobile:w-[345px] h-[356px] mobile:h-[230px] py-[42px] mobile:py-[15px] px-[40px] mobile:px-[20px] rounded-[8px]"
              src={items.video?.video.replace(
                "https://youtu.be/",
                "https://www.youtube.com/embed/",
              )}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            >
            </iframe>
            <div class="flex flex-col items-center py-[94px] mobile:py-[15] px-[40px] mobile:px-[20px]">
              <Icon id="castle" />
              <p class="font-beccaPerry mb-[20px] text-[40px] mobile:text-[28px] text-[#676767] text-center">
                {items.video?.videoTitle}
              </p>
              <p class="font-regular text-[12px] text-[#7E7F88] max-w-[689px] text-center">
                {items.video?.videoText.replace(
                  /<\/?(p|span|ol|li)[^>]*>/g,
                  "",
                )}
              </p>
            </div>
          </div>
        )
      )}
      {company && (
        <div class="flex flex-col items-center justify-center text-center container mt-[100px] mb-[100px]">
          <div class="mb-[50px]">
            <p class="font-beccaPerry font-medium text-[40px] mobile:text-[28px] text-[#676767] mb-[20px]">
              {company.title}
            </p>
            <p class="font-bold text-[13px] text-[#676767]">
              {company.subTitle}
            </p>
          </div>
          <div class="flex flex-row mobile:flex-col items-center justify-center w-full container mb-[50px]">
            {company.items?.map((item) => (
              <div class="flex flex-col items-center text-center mx-[20px] mobile:my-[20px] mobile:mx-0">
                <div class="font-bold text-[28px]">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.mainInfo ? item.mainInfo : "",
                    }}
                  />
                </div>
                <p class="text-[13px] w-[162px] text-center text-[#676767]">
                  {item.textAboutInfo}
                </p>
              </div>
            ))}
          </div>
          <div class="text-center mobile:text-left text-[#676767] text-[14px] mobile:text-[12px]">
            <p
              dangerouslySetInnerHTML={{
                __html: company.text ? company.text : "",
              }}
            />
          </div>
        </div>
      )}

      {additionalInfo && (
        <div class="container flex flex-col items-center justify-center w-full mb-[100px]">
          <div class="font-beccaPerry text-center text-[40px] mobile:text-[28px] text-[#FF8300] mb-[40px]">
            <p>{additionalInfo.title}</p>
            <p
              dangerouslySetInnerHTML={{
                __html: additionalInfo.subtitle ? additionalInfo.subtitle : "",
              }}
            />
          </div>
          <span class="flex container justify-center w-full">
            {additionalInfo.image?.map((image) => (
              <Image
                class="mx-[20px] mobile:mx-[8.5px] mobile:w-[100px]"
                src={image.image}
                width={120}
                height={120}
                alt={image.alt}
              />
            ))}
          </span>
        </div>
      )}
    </>
  );
}
