import MiniMe from "site/islands/MiniMeDoll/MiniMe.tsx";

import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

import type { DollTypes } from "../../../loaders/MiniMe/minime.ts";

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

export default function MakeYourMiniMe(props: Props) {
  return (
    <>
      <MiniMe {...props} />
    </>
  );
}
