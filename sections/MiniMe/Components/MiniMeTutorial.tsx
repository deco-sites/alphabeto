import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  title: string;
  subtitle: string;
  mainImage?: ImageWidget;
  description: RichText;

  label: string;

  steps: Steps;
}

interface Steps {
  stepOne: StepsProps;
  stepTwo: StepsProps;
  stepThree: StepsProps;
}

/**@title Informações dos Passos*/
interface StepsProps {
  title: string;
  description: string;
}

export default function MiniMeTutorial(
  {
    title,
    subtitle,
    description,
    label,
    mainImage,
    steps,
  }: Props,
) {
  return (
    <>
      <section class="flex items-center justify-center my-[85px] container">
        <div class="relative max-w-[647px] w-[100%]">
          {mainImage && (
            <>
              <Image
                src={mainImage}
                width={477}
                height={433}
                alt="Criança sorridente segurando bonecas"
                class=""
              />
            </>
          )}
        </div>
        <div class="max-w-[664px] w-[100%] ml-[40px]">
          <div>
            <h2 class="font-Quicksand text-[#F98300] font-bold mt-[10px]">
              {title}
            </h2>
          </div>
          <div>
            <h3 class="font-beccaPerry text-[44px] font-medium text-[#676767]">
              {subtitle}
            </h3>

            <section class="flex items-center justify-between max-w-[668px] w-[100%]">
              <div class="bg-[#FF859A] max-w-[220px] w-[100%] h-[240px] p-[12px] relative rounded-[8px] mr-[14px]">
                <p class="font-Quicksand text-[100px] font-bold absolute top-[-30px] left-[12px] opacity-[30%] text-[#FCFCFC] z-[0]">1</p>
                <Icon
                  id="minime-step-1"
                  width="40"
                  height="40"
                  class="absolute top-[12px] right-[12px]"
                />
                <h4 class="font-beccaPerry text-[20px] font-medium text-[#676767] mt-[56px] pl-[24px] absolute z-[1]">{steps.stepOne.title}</h4>
                <p class="font-Quicksand text-[13px] font-medium text-center text-[#7E7F88] absolute bottom-[12px]">{steps.stepOne.description}</p>
              </div>
              <div class="bg-[#70D1E8] max-w-[220px] w-[100%] h-[240px] p-[12px] relative rounded-[8px] mr-[14px]">
                <p class="font-Quicksand text-[100px] font-bold absolute top-[-30px] left-[12px] opacity-[30%] text-[#FCFCFC] z-[0]">2</p>
                <Icon
                  id="minime-step-2"
                  width="40"
                  height="40"
                  class="absolute top-[12px] right-[12px]"
                />
                <h4 class="font-beccaPerry text-[20px] font-medium text-[#676767] mt-[56px] pl-[24px] absolute z-[1]">{steps.stepTwo.title}</h4>
                <p class="font-Quicksand text-[13px] font-medium text-center text-[#7E7F88] absolute bottom-[12px]">{steps.stepTwo.description}</p>
              </div>
              <div class="bg-[#D6DE23] max-w-[220px] w-[100%] h-[240px] p-[12px] relative rounded-[8px]">
                <p class="font-Quicksand text-[100px] font-bold absolute top-[-30px] left-[12px] opacity-[30%] text-[#FCFCFC] z-[0]">3</p>
                <Icon
                  id="minime-step-3"
                  width="40"
                  height="40"
                  class="absolute top-[12px] right-[12px]"
                />
                <h4 class="font-beccaPerry text-[20px] font-medium text-[#676767] mt-[56px] pl-[24px] absolute z-[1]">{steps.stepThree.title}</h4>
                <p class="font-Quicksand text-[13px] font-medium text-center text-[#7E7F88] absolute bottom-[12px]">{steps.stepThree.description}</p>
              </div>
            </section>

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
