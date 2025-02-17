import type { PartType } from "../../loaders/MiniMe/minime.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import DollPrice from "site/islands/components/DollPrice.tsx";
import { Signal, useSignal } from "@preact/signals";

/**@title Informações da Mini Me*/
interface Props {
  selectedParts: Signal<{ [key: string]: string }>;
  types: PartType[];
  step: number;
  changeStep: (operation: string) => void;
  product: ProductDetailsPage | null;
}

export default function DollButtons(props: Props) {
  const isSelect = useSignal(false);
  const buttonText = useSignal("Avançar");

  const blockButton = () => {
    if(!props.selectedParts.value[props.types[props.step].nome] && props.step < props.types.length - 2){
      isSelect.value = true;
      buttonText.value = "Selecione uma parte";

      setTimeout(() => {
        isSelect.value = false;
        buttonText.value = "Avançar";
      }, 1500);
      
      return;
    }

    props.changeStep("increment");
  };

    return (
    <>
      <div class="mobile:absolute mobile:top-[925px] mt-[80px] flex mobile:flex-col mobile:justify-center items-center justify-between bg-[#FDF6ED] max-w-[773px] w-full h-[96px] mobile:h-[149px] container rounded-[8px]">
        <DollPrice product={props.product} />
        <div class="flex items-center justify-end w-full">
          <button
            onClick={() => props.changeStep("decrement")}
            class="font-Quicksand text-[#FF8300] mr-[20px] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#fff] border-[#FF8300] border-[1px] rounded-[8px]"
          >
            Voltar
          </button>
          <button
            onClick={blockButton}
            class={`font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] ${isSelect.value === true ? `text-[#7E7F88] bg-gray-400 border-[#FF8300] border-[1px]` : `bg-[#FF8300] border-[#FF8300] border-[1px]`} rounded-[8px] transition-all`}
          >
            {props.step > props.types.length - 2 ? "Concluir boneca" : buttonText.value}
          </button>
        </div>
      </div>
    </>
  );
}
