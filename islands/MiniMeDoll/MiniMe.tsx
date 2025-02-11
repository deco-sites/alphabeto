import type { DollTypes } from "../../loaders/MiniMe/minime.ts"
import { useRef, useState } from "preact/hooks";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";
import PopupMiniMe from "site/islands/MiniMeDoll/PopupMiniMe.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import DollComponents from "site/islands/components/DollComponents.tsx";
import DollImage from "site/islands/components/DollImage.tsx";
import DollTitle from "site/islands/components/DollTitle.tsx";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: DollTypes;
  partSelected: DollTypes[];

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

export default function MiniMe(props: Props) {
  console.log("NewdollParts: ", props.dollParts)
  
  const [IsOpen, setIsOpen] = useState(false)

  return (
    <>
      <section class="mobile:relative container flex mobile:flex-col-reverse max-w-[1360px] w-full mb-[100px]">
      
      <DollImage {...props} />

        <div class="relative max-w-[773px] w-full h-[735px] mobile:h-[450px]">
        <DollTitle {...props} />
          <DollComponents {...props} />
        </div>
      </section>
    </>
  );
}
