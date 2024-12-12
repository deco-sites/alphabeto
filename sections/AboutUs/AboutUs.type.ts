import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

/**@title Imagems */
interface ImageProps {
    /**@title Primeira Imagem da primeira seção */
    firstImage?: ImageWidget;
    /**@title Segunda Imagem da primeira seção */
    secondFirstImage?: ImageWidget;
    /**@title Segunda Imagem da segunda seção */
    secondImage?: ImageWidget;
}
  
/**@title Vídeos */
interface VideoProps {
    /**@title Título da seção de vídeo */
    videoTitle: string;
    /**@title Texto da seção de vídeo */
    videoText: RichText;
    /**@title URL do Vídeo */
    video: string;
}

  
/**@title Informação */
interface InfoItemsProps {
    /**@title Informação principal */
    mainInfo: RichText;
    /**@title Texto sobre a informação */
    textAboutInfo: string;
}

/**@title Informações adicionais */
export interface AdditionalInfo {
    title?: string;
    subtitle?: RichText;
    image: ImageWidget[];
}

/**@title Informações sobre a empresa */
export interface CompanyProps {
    /**@title Título */
    title?: string;
    /**@title Subtítulo */
    subTitle?: string;
    /**@title Pontos de informação */
    items?: InfoItemsProps[];
    /**@title Texto geral */
    text?: RichText;
  }
  
  /**@title Parágrafos */
export interface AboutUsProps {
    /**@title Primeiro Parágrafo */
    firstText?: RichText;
    /**@title Segundo Parágrafo */
    secondText?: RichText;
    images?: ImageProps;
    video?: VideoProps;
  }