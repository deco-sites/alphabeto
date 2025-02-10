import type { DollTypes } from "../../loaders/MiniMe/minime.ts"
import { useRef, useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: DollTypes
  partSelected: DollTypes[];

  page: ProductDetailsPage | null;

  /**@title Textos de conclusão*/
  finishStep: FinishStep;
}

interface FinishStep {
  /**@title Título final*/
  finalTitle: string;
  /**@title Mensagem final*/
  finalMessage: string;
  /**@title Mensagem de conclusão*/
  finishText?: string;
}

export default function DollComponents(props: Props){
      const [step, setStep] = useState(0);
      const [stepSelected, setStepSelected] = useState(localStorage.getItem('selectedStep') || "pele");
      
      const [IsOpen, setIsOpen] = useState(false)
      
      const scrollContainerRef = useRef<HTMLDivElement | null>(null);
      const scrollQtd = 250;
      
      console.log(`step: ${step}, stepSelected: ${stepSelected}`)
    
      const scrollItems = (side: string) => {
        if (scrollContainerRef.current) {
          if (side === "left") {
            scrollContainerRef.current.scrollBy({
              left: -scrollQtd,
              behavior: "smooth",
            });
          } else if (side === "right") {
            scrollContainerRef.current.scrollBy({
              left: +scrollQtd,
              behavior: "smooth",
            });
          }
        }
      };
    
      // Dependendo do botão selecionado, 'voltar' ou 'avançar',
      // a função abaixo determina se sobe ou desce os passos
      const changeStep = (operation: string) => {
        let i = localStorage.getItem('step') || "0";
    
        const selectStep = (currentStep: string) => {
          let selectedStep = localStorage.getItem('selectedStep') || '';
          switch(Number(currentStep)){
            case 0: 
            selectedStep = "pele"
               setStepSelected(selectedStep)
              break;
            case 1: 
            selectedStep = "cabelo"
              setStepSelected(selectedStep)
              break;
            case 2: 
            selectedStep = "face"
              setStepSelected(selectedStep)
              break;
            case 3: 
            selectedStep = "roupa"
              setStepSelected(selectedStep)
              break;
            case 4: 
            selectedStep = "acessórios"
              setStepSelected(selectedStep)
              break;
            case 5: 
            selectedStep = "cheirinho"
              setStepSelected(selectedStep)
              break;
            case 6: 
            selectedStep = "null"
              setStepSelected(selectedStep)
              break;
              default:
          }
          localStorage.setItem("selectedStep", selectedStep);
        }
    
        if(operation === "increment" && step >= 6){
          setIsOpen(true)
        }
    
        if (operation === "increment" && step < 6) {
          i = JSON.stringify(step + 1);
          selectStep(i)
        } else if (operation === "decrement" && step > 0) {
          i = JSON.stringify(step - 1);
          selectStep(i)
        }
    
        localStorage.setItem("step", i);
        setStep(Number(i));
      };

    return(
        <>
        <div class="mb-[36px]">
            <div
              ref={scrollContainerRef}
              class="flex mobile:overflow-scroll overflow-hidden max-w-[773px] h-[370px] mobile:h-[232px] w-full items-center"
            >
              <div class="flex items-center">
                {props.dollParts[stepSelected] ? props.dollParts[stepSelected].map((part) => (
                                    <>
                                    <div
                                      class={props.dollParts
                                        ? `flex flex-col items-center w-[138px] h-[237px] mr-[4px] bg-[#fff] rounded-[8px] border-[1px] border-[#D6DE23]`
                                        : `flex flex-col items-center w-[138px] h-[237px] mr-[4px] rounded-[8px] cursor-pointer hover:rounded-[8px] transition duration-300 hover:border-[0.5px] hover:border-[#D6DE23]`}
                                    >
                                      <img class="mobile:w-[97px] mobile:h-[158px]" src={part.img_frente} />
                                      <p class="font-Quicksand text-[#7E7F88] text-[16px] mobile:text-[12px] text-center">
                                        {part.id}
                                      </p>
                                    </div>
                                  </>
                )) : null}
                { stepSelected === 'null' && (
                  <div class="flex flex-col justify-center ml-[121px]">
                    <h3 class="font-beccaPerry text-[#FF8300] text-[40px]">{props.finishStep.finalTitle}</h3>
                  <div class="flex flex-col w-full font-Quicksand mb-[37px]">

                </div>
                <p class="font-Quicksand text-[20px] text-[#7E7F88] font-bold text-center">{props.finishStep.finalMessage}</p>
                <p class="font-Quicksand text-[16px] text-[#7E7F88] font-medium text-center">{props.finishStep.finishText}</p>
                </div>
                )}
              </div>
            </div>
            <button
              onClick={() => scrollItems("left")}
              class="flex items-center justify-center absolute mobile:bottom-[50px] left-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full rotate-[180deg] p-[12px]"
            >
              <Icon id="simple-arrow-right"  />
            </button>
            <button
              onClick={() => scrollItems("right")}
              class="flex items-center justify-center absolute mobile:bottom-[50px] right-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full p-[12px]"
            >
              <Icon id="simple-arrow-right"  />
            </button>
          </div>
          <div class="mobile:absolute mobile:top-[925px] mt-[80px] flex mobile:flex-col mobile:justify-center items-center justify-between bg-[#FDF6ED] max-w-[773px] w-full h-[96px] mobile:h-[149px] container rounded-[8px]">
            <div class="flex flex-col mobile:items-center justify-start mobile:justify-center w-full mobile:mb-[20px]">
              <h3 class="font-Quicksand font-bold text-[26px] mobile:text-[18px] text-[#676767]">
                Total: <b class="text-[#FF8300]">R$ </b>
              </h3>
              <p class="font-Quicksand text-[#7E7F88] mobile:text-[12px]">
                Em até 2x R$ sem juros
              </p>
            </div>
            <div class="flex items-center justify-end w-full">
              <button
                onClick={() => changeStep("decrement")}
                class="font-Quicksand text-[#FF8300] mr-[20px] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#fff] border-[#FF8300] border-[1px] rounded-[8px]"
              >
                Voltar
              </button>
              <button
                onClick={() => changeStep("increment")}
                class="font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]"
              >
                {props.dollParts ? "Concluir boneca" : "Avançar"}
              </button>
            </div>
          </div>
        </>
    )
}