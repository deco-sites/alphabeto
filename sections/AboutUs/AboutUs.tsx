import type { ImageWidget } from "apps/admin/widgets.ts";
import {
  AboutUsProps,
  AdditionalInfo,
  CompanyProps,
} from "site/sections/AboutUs/AboutUs.type.ts";
import Icon from "site/components/ui/Icon.tsx";

/**@title Conteúdo */
interface ItemsAboutUs {
  /**@title Banner principal */
  banner?: ImageWidget;
  /**@title Título da página */
  title?: string;
  /**@title Logo */
  logo?: ImageWidget;
  /**@title Paragráfos */
  items: AboutUsProps[];
  /**@title Sobre a empresa */
  company: CompanyProps;
  /**@title Informação adicional */
  additionalInfo: AdditionalInfo;
}

export default function AboutUs(
  { items, company, additionalInfo, title, logo, banner }: ItemsAboutUs,
) {
  return (
    <>
      <div class="flex justify-center w-full">
        <img src={banner} alt="" />
      </div>
      <div class={`h-64 w-full flex flex-col items-center mt-[40px]`}>
        <img src={logo} alt="" />
        <h2 class="font-beccaPerry absolute mt-[64px] text-[44px] text-[#676767]">
          {title}
        </h2>
      </div>

      {items.map((items, index) => (
        <div key={index} class="container">
          <div class="flex items-center">
            <p class="font-regular text-[12px] text-[#7E7F88] max-w-[787px] h-[100%]">
              {items.firstText
                ? items.firstText.replace(/<\/?(p|span|ol|li)[^>]*>/g, "")
                : ""}
            </p>
            <div class="relative w-[100%] h-[100%] z-5">
              <Icon
                id="star"
                width="47"
                height="50"
                class="absolute mt-[60px] right-[350px] z-10"
              />
              <img
                class="absolute z-5 top-[-100px] right-0 w-[389px]"
                src={items.images?.firstImage}
              />
              <img
                class="absolute mt-[100px] z-5 top-0 right-[-40px] w-[320px]"
                src={items.images?.secondFirstImage}
                alt=""
              />
            </div>
          </div>
          <div class="container flex items-center">
            <img src={items.images?.secondImage} />
            <p class="font-regular text-[12px] text-[#7E7F88] max-w-[700px] mt-[65px]">
              {items.secondText
                ? items.secondText.replace(/<\/?(p|span|ol|li)[^>]*>/g, "")
                : ""}
            </p>
          </div>
        </div>
      ))}

      {items.map((items) =>
        items.video && (
          <div class="relative flex mobile:flex-col-reverse justify-around items-center bg-[#F7E0BF] mt-[144px] w-full">
            <Icon id="star" width="47" height="50" class="absolute top-[35px] left-[20px] z-10"/>
            <Icon id="minor-star" width="28" height="30" class="absolute top-[20px] left-[55px] z-10"/>
            <Icon id="star" width="47" height="50" class="absolute bottom-[35px] right-[20px] z-10"/>
            <Icon id="minor-star" width="28" height="30" class="absolute bottom-[70px] right-[55px] z-10"/>
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
              <img class="mx-[20px] mobile:mx-[8.5px] mobile:w-[100px]" src={image} alt="" />
            ))}
          </span>
        </div>
      )}
    </>
  );
}
