import MiniMeDoll from "site/islands/MiniMeDoll/MiniMeDoll.tsx";

import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

import type { MiniMe } from "../../../loaders/MiniMe/minime.ts";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  step: number;

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

export default function MakeYourMiniMe(props: Props) {
  return (
    <>
      <MiniMeDoll {...props} />
    </>
  );
}
