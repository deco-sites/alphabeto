import type { MiniMe } from "../../loaders/MiniMe/minime.ts";
import { useSignal } from "@preact/signals";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import DollParts from "../components/DollParts.tsx";
import DollButtons from "site/islands/components/DollButtons.tsx";
import DollImage from "site/islands/components/DollImage.tsx";
import DollTitle from "site/islands/components/DollTitle.tsx";
import DollProgress from "site/islands/components/DollProgress.tsx";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  /**@title Título da Mini Me*/
  title: string;
  /**@title Imagem de fundo da boneca*/
  image: ImageWidget;
  /**@title Título do Popup*/
  popupTitle?: RichText;
  /**@title Texto do Termos e Condições*/
  popupTerms?: RichText;

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

export default function MiniMeDoll(props: Props) {
  const step = useSignal(Number(localStorage.getItem("step") || "0"));

  
  const changeStep = (operation: string) => {
  
      if (operation === "increment" && step.value < 6) {
        step.value += 1;
      } else if (operation === "decrement" && step.value > 0) {
        step.value -= 1;
      }
  
      localStorage.setItem("step", JSON.stringify(step.value));
  }

  const type = props.dollParts.types[step.value]

  return (
    <>
      <section class="mobile:relative container flex mobile:flex-col-reverse max-w-[1360px] w-full mb-[100px]">
      
      <DollImage {...props} />

        <div class="relative max-w-[773px] w-full h-[735px] mobile:h-[450px]">
        <DollTitle step={step.value} {...props} />
        <DollProgress step={step.value} {...props} />
          <DollParts {...props} type={type}/>
          <DollButtons {...props} step={step.value} changeStep={changeStep}/>
        </div>
      </section>
    </>
  );
}
