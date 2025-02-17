import type { MiniMe } from "../../loaders/MiniMe/minime.ts";
import { useSignal } from "@preact/signals";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import DollParts from "../components/DollParts.tsx";
import DollButtons from "site/islands/components/DollButtons.tsx";
import DollImage from "site/islands/components/DollImage.tsx";
import DollTitle from "site/islands/components/DollTitle.tsx";
import DollProgress from "site/islands/components/DollProgress.tsx";
import PopupMiniMe from "site/islands/MiniMeDoll/PopupMiniMe.tsx";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  /**@title Título da Mini Me*/
  title: string;
  /**@title Imagem de fundo da boneca*/
  image: ImageWidget;
  /**@title Título do Popup*/
  popupTitle: string;
  /**@title Texto do Termos e Condições*/
  popupTerms: RichText;

  product: ProductDetailsPage | null;

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

export default function MiniMeDoll(props: Props) {
  const step = useSignal(Number(localStorage.getItem("step") || "0"));
  const handlePopup = useSignal(false);
  const selectedParts = useSignal<{ [key: string]: string }>({})
  console.log("a: ", selectedParts)

  const changeStep = (operation: string) => {
    if (
      operation === "increment" && step.value > props.dollParts.types.length - 2
    ) {
      handlePopup.value = !handlePopup.value;
    }

    if (operation === "increment" && step.value < 6 && selectedParts.value[type.nome] !== undefined) {
      step.value += 1;
    } else if (operation === "decrement" && step.value > 0) {
      step.value -= 1;
    }

    localStorage.setItem("step", JSON.stringify(step.value));
  };

  const type = props.dollParts.types[step.value];

  return (
    <>
      <section class="mobile:relative container flex mobile:flex-col-reverse max-w-[1360px] w-full mb-[100px]">
        <DollImage handlePopup={handlePopup} step={step} selectedParts={selectedParts} type={type} {...props} />

        <div class="relative max-w-[773px] w-full h-[735px] mobile:h-[450px]">
          <DollTitle step={step.value} {...props} />
          <DollProgress step={step.value} types={props.dollParts.types} />
          <DollParts {...props} selectedParts={selectedParts} type={type} />
          <DollButtons
            selectedParts={selectedParts}
            types={props.dollParts.types}
            step={step.value}
            changeStep={changeStep}
            {...props}
          />
        </div>
        {handlePopup.value && (
          <PopupMiniMe
          step={step} handlePopup={handlePopup} selectedParts={selectedParts} type={type}
            {...props}
          />
        )}
      </section>
    </>
  );
}
