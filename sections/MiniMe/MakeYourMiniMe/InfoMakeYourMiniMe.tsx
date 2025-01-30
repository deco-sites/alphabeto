import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  title: string;
  description: RichText;

  image?: ImageWidget;
  altText?: string;

  /**@title Informações sobre a boneca*/
  infos?: Info;
}

interface Info {
  /**@title Informações sobre o tempo de produção*/
  timeProduction: InfoProps;
  /**@title Informações sobre o produto*/
  aboutProduct: InfoProps;
  /**@title Informações sobre a composição*/
  aboutComposition: InfoProps;
}

interface InfoProps {
  /**@title Títuto*/
  title: string;
  /**@title Descrição*/
  description: string;
}

export default function InfoMakeYourMiniMe(
  { title, description, image, altText, infos }: Props,
) {
  return (
    <>
      <article class="mobile:flex-col-reverse flex bg-[#70D1E8] w-full mb-[100px]">
        <div>
          {image && (
            <Image
              src={image}
              width={728}
              height={596}
              alt={altText}
            />
          )}
        </div>
        <section class="py-[36px] px-[24px]">
          <div>
            <h2 class="font-beccaPerry mobile:text-[28px] text-[40px] font-medium text-[#676767]">
              {title}
            </h2>
            <div>
              <p
                class="font-Quicksand"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
          <div class="mt-[44px]">
            <div class="flex items-center mb-[62px]">
              <div class="relative">
                <Icon
                  id="clock"
                  width="50"
                  height="50"
                />
                <hr class="absolute top-[80px] left-[-6px] mobile:left-[-30px] border-dashed border-b-[1px] w-[63px] mobile:w-[110px] border-[#F98300] rotate-[90deg]" />
              </div>
              <div class="font-Quicksand ml-[14px]">
                <h3 class="font-bold text-[14px] text-[#676767] mb-[7px]">
                  {infos?.timeProduction.title}
                </h3>
                <p class="font-medium text-[13px] text-[#7E7F88]">
                  {infos?.timeProduction.description}
                </p>
              </div>
            </div>
            <div class="flex items-center mb-[62px]">
              <div class="relative">
                <Icon
                  id="product_description_mini-me"
                  width="50"
                  height="50"
                />
                <hr class="absolute top-[80px] left-[-6px] mobile:left-[-30px] border-dashed border-b-[1px] w-[63px] mobile:w-[110px] border-[#F98300] rotate-[90deg]" />
              </div>
              <div class="font-Quicksand ml-[14px]">
                <h3 class="font-bold text-[14px] text-[#676767] mb-[7px]">
                  {infos?.aboutProduct.title}
                </h3>
                <p class="font-medium text-[13px] text-[#7E7F88]">
                  {infos?.aboutProduct.description}
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="relative">
                <Icon
                  id="composition"
                  width="50"
                  height="50"
                />
              </div>
              <div class="font-Quicksand ml-[14px]">
                <h3 class="font-bold text-[14px] text-[#676767] mb-[7px]">
                  {infos?.aboutComposition.title}
                </h3>
                <p class="font-medium text-[13px] text-[#7E7F88]">
                  {infos?.aboutComposition.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
