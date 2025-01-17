import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface Props {
  title: string;
  subtitle: string;
  description: RichText;

  label: string;
  mainImage?: ImageWidget;
  backImage?: ImageWidget;
}

export default function AboutMiniMe(
  { title, subtitle, description, label, mainImage, backImage }: Props,
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
                alt="Criança com problemas de locomoção sorridente com uma boneca inclusiva"
                class="mobile:w-[263px] mobile:h-[238px]"
              />
            </>
          )}
          {backImage && (
            <>
              <Image
                src={backImage}
                width={340}
                height={286}
                alt="Criança sorridente com boneca"
                class="absolute top-[185px] left-[307px]"
              />
            </>
          )}
        </div>
        <div class="max-w-[664px] w-[100%] ml-[40px]">
          <div>
            <h2 class="font-Quicksand mobile:text-[16px] text-[#F98300] font-bold mt-[10px]">
              {title}
            </h2>
          </div>
          <div>
            <h3 class="font-beccaPerry mobile:text-[32px] text-[44px] font-medium text-[#676767]">
              {subtitle}
            </h3>
            <p
              class="font-Quicksand mt-[20px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
          <button class="w-[100%] max-w-[197px] h-[44px] bg-[#F98300] mt-[30px] font-Quicksand text-[#FFF] text-[14px] font-bold rounded-[8px]">
          <a href="/faca-sua-boneca">{label}</a>
          </button>
        </div>
      </section>
    </>
  );
}