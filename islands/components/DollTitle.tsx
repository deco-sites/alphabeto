import type { DollTypes } from "../../loaders/MiniMe/minime.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { useState } from "preact/hooks";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: DollTypes;
  partSelected: DollTypes[];

  /**@title Título da Mini Me*/
  title: string;

  page: ProductDetailsPage | null;
}

export default function DollTitle(props: Props) {
    const [stepCount, setStepCount] = useState(Number(localStorage.getItem('step') || "0"));
    const [stepSelectedCount, setStepSelectedCount] = useState(localStorage.getItem('selectedStep') || "pele");

    const selectStep = (currentStep: string) => {
        let selectedStep = localStorage.getItem('selectedStep') || '';
        switch(Number(currentStep)){
          case 0: 
          selectedStep = "pele"
          setStepSelectedCount(selectedStep)
            break;
          case 1: 
          selectedStep = "cabelo"
          setStepSelectedCount(selectedStep)
            break;
          case 2: 
          selectedStep = "face"
          setStepSelectedCount(selectedStep)
            break;
          case 3: 
          selectedStep = "roupa"
          setStepSelectedCount(selectedStep)
            break;
          case 4: 
          selectedStep = "acessórios"
          setStepSelectedCount(selectedStep)
            break;
          case 5: 
          selectedStep = "cheirinho"
          setStepSelectedCount(selectedStep)
            break;
          case 6: 
          selectedStep = "null"
          setStepSelectedCount(selectedStep)
            break;
            default:
        }
      }


  return (
    <>
      <div>
        <h2 class="font-beccaPerry text-[#676767] text-[44px] mobile:text-[32px] mb-[36px]">
          {props.title}
        </h2>
      </div>
      <div class="flex items-center relative mb-[36px] w-full">
        {props.dollParts[stepSelectedCount].map((i, index) => (
          <>
            <p
              class={stepCount >= index
                ? `font-Quicksand bg-[#D6DE23] w-[40px] h-[40px] text-[20px] text-[#F98300] py-[4px] px-[14px] rounded-[50%] font-bold`
                : `text-[#C5C5C5] bg-[#F5F4F1] font-Quicksand w-[40px] h-[40px] text-[20px] py-[4px] px-[14px] rounded-[50%] font-bold`}
            >
              {`${index + 1}`}
            </p>
            {index !== 7 && (
              <hr
                class={stepCount >= index
                  ? `border-dashed border-b-[1px] w-[80px] border-[#F98300]`
                  : `border-dashed border-b-[1px] w-[80px] border-[#C5C5C5]`}
              />
            )}
          </>
        ))}
      </div>

    </>
  );
}
