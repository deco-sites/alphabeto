import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  title: string;
  subtitle: string;
  description: RichText;

  label: string;
  mainImage?: ImageWidget;
  altTextMainImage?: string;
  secondaryImage?: ImageWidget;
  altTextBackImage?: string;
}

export default function AboutMiniMe(
  { title, subtitle, description, label, mainImage, secondaryImage, altTextMainImage, altTextBackImage }: Props,
) {
  return (
    <>
      <section class="flex mobile:flex-col-reverse items-center justify-center my-[85px] container mobile:p-0">
        <div class="relative max-w-[647px] w-[100%] mobile:max-w-[334px]">
          {mainImage && (
            <>
              <Image
                src={mainImage}
                width={477}
                height={433}
                alt={altTextMainImage}
                class="mobile:w-[263px] mobile:h-[238px]"
              />
            </>
          )}
          {secondaryImage && (
            <>
              <Image
                src={secondaryImage}
                width={340}
                height={286}
                alt={altTextBackImage}
                class="absolute top-[185px] left-[307px] mobile:left-[45%] mobile:w-[174px]"
              />
            </>
          )}
        </div>
        <div class="max-w-[664px] w-[100%] mobile:max-w-[335px] ml-[40px] mobile:ml-[0] mobile:mb-[40px]">
          <div>
            <h2 class="font-Quicksand mobile:text-[16px] text-[#F98300] font-bold mt-[10px]">
              {title}
            </h2>
          </div>
          <div>
            <h3 class="font-beccaPerry mobile:text-[32px] text-[44px] font-medium text-[#676767]">
              {subtitle}
            </h3>
            <div class="mobile:text-[12px]">
            <p
              class="font-Quicksand mt-[20px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            </div>
          </div>
          <button class="w-[100%] max-w-[197px] h-[44px] bg-[#F98300] mt-[30px] font-Quicksand text-[#FFF] text-[14px] font-bold rounded-[8px]">
          <a href="/almofada-boneca-mini-me-55724/p">{label}</a>
          </button>
        </div>
      </section>
    </>
  );
}
