import type { MiniMe } from "../../loaders/MiniMe/minime.ts";
import { useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";

/**@title Informações da Mini Me*/
interface Props {
  step: number;
  changeStep: (operation: string) => void;
}

export default function DollButtons(props: Props) {

    console.log("step em buttons: ", props.step)

    return (
    <>
      <div class="mobile:absolute mobile:top-[925px] mt-[80px] flex mobile:flex-col mobile:justify-center items-center justify-between bg-[#FDF6ED] max-w-[773px] w-full h-[96px] mobile:h-[149px] container rounded-[8px]">
        <div class="flex flex-col mobile:items-center justify-start mobile:justify-center w-full mobile:mb-[20px]">
          <h3 class="font-Quicksand font-bold text-[26px] mobile:text-[18px] text-[#676767]">
            Total: <b class="text-[#FF8300]">R$</b>
          </h3>
          <p class="font-Quicksand text-[#7E7F88] mobile:text-[12px]">
            Em até 2x R$ sem juros
          </p>
        </div>
        <div class="flex items-center justify-end w-full">
          <button
            onClick={() => props.changeStep("decrement")}
            class="font-Quicksand text-[#FF8300] mr-[20px] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#fff] border-[#FF8300] border-[1px] rounded-[8px]"
          >
            Voltar
          </button>
          <button
            onClick={() => props.changeStep("increment")}
            class="font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]"
          >
            {props.step ? "Concluir boneca" : "Avançar"}
          </button>
        </div>
      </div>
    </>
  );
}
