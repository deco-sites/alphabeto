import type { MiniMe } from "../../loaders/MiniMe/minime.ts";
import { useRef, useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { PartiallyEmittedExpression } from "https://deno.land/x/ts_morph@21.0.1/mod.ts";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  step: number;

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

export default function DollComponents(props: Props) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollQtd = 250;

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

  const name = Object.keys(props.dollParts.parts)[props.step];

  return (
    <>
      <div class="mb-[36px]">
        <div
          ref={scrollContainerRef}
          class="flex mobile:overflow-scroll overflow-hidden max-w-[773px] h-[370px] mobile:h-[232px] w-full items-center"
        >
          <div class="flex items-center">
            {name &&
              props.dollParts.parts[name].map((part) => (
                <>
                  <div
                    class={props.dollParts
                      ? `flex flex-col items-center w-[138px] h-[237px] mr-[4px] bg-[#fff] rounded-[8px] border-[1px] border-[#D6DE23]`
                      : `flex flex-col items-center w-[138px] h-[237px] mr-[4px] rounded-[8px] cursor-pointer hover:rounded-[8px] transition duration-300 hover:border-[0.5px] hover:border-[#D6DE23]`}
                  >
                    <img
                      class="mobile:w-[97px] mobile:h-[158px]"
                      src={part.img_frente}
                    />
                    <p class="font-Quicksand text-[#7E7F88] text-[16px] mobile:text-[12px] text-center">
                      {part.id}
                    </p>
                  </div>
                </>
              ))}
            {stepSelected === "null" && (
              <div class="flex flex-col justify-center ml-[121px]">
                <h3 class="font-beccaPerry text-[#FF8300] text-[40px]">
                  {props.finishStep.finalTitle}
                </h3>
                <div class="flex flex-col w-full font-Quicksand mb-[37px]">
                </div>
                <p class="font-Quicksand text-[20px] text-[#7E7F88] font-bold text-center">
                  {props.finishStep.finalMessage}
                </p>
                <p class="font-Quicksand text-[16px] text-[#7E7F88] font-medium text-center">
                  {props.finishStep.finishText}
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => scrollItems("left")}
          class="flex items-center justify-center absolute mobile:bottom-[50px] left-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full rotate-[180deg] p-[12px]"
        >
          <Icon id="simple-arrow-right" />
        </button>
        <button
          onClick={() => scrollItems("right")}
          class="flex items-center justify-center absolute mobile:bottom-[50px] right-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full p-[12px]"
        >
          <Icon id="simple-arrow-right" />
        </button>
      </div>
    </>
  );
}
