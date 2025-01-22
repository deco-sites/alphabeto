import MiniMe from "site/islands/MiniMeDoll/MiniMe.tsx";

import { ImageWidget } from "apps/admin/widgets.ts";

/**@title Informações da Mini Me*/
interface Props {
    /**@title Título da Mini Me*/
    title: string;
    /**@title Preço da boneca (sem R$):*/
    price: number;
    /**@title Até quantas vezes o valor pode ser parcelado:*/
    installments: number; 
    /**@title Imagem de fundo da boneca*/
    image: ImageWidget;
}

export default function MakeYourMiniMe(props: Props) {
  return (
    <>
      <MiniMe {...props}/>
    </>
  );
}
