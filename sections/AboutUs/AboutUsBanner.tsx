import { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

interface Props {
  desktop: ImageWidget;
  mobile: ImageWidget;
  /**
   * @title Texto alternativo
   * @description Descrição da imagem para pessoas com deficiência visual
   */
  alt: string;
}

/** @title Sobre Nós - Banner	*/
export default function AboutUsBanner({ desktop, mobile, alt }: Props) {
  return (
    <Picture>
      <Source media="(max-width: 768px)" src={mobile} width={375} />
      <Source media="(min-width: 769px)" src={desktop} width={1440} />
      <img
        src={desktop}
        alt={alt}
        class="w-full"
      />
    </Picture>
  );
}
