import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import type { MiniMe, PartType } from "../../../loaders/MiniMe/minime.ts";
import Icon from "site/components/ui/Icon.tsx";
import { Signal } from "@preact/signals";

interface Props {
  dollParts: MiniMe;
  /**@title Imagem de fundo da boneca*/
  image: ImageWidget;

  step: Signal<number>;

  selectedParts: Signal<{ [key: string]: string }>;

  type: PartType;

  handlePopup: Signal<boolean>;
}

export default function DollImage(props: Props) {
  
  return (
    <>
      <div class="relative max-w-[259px] mobile:max-w-[267px] w-full bg-[#F7E0BF] h-[420px] mobile:mt-[20px] mobile:mx-[34px] mobile:h-[323px] rounded-tl-[8px] rounded-bl-[8px] mobile:rounded-[8px]">
        {Object.keys(props.selectedParts.value).length > 0 &&
          Object.entries(props.selectedParts.value).map(([key, id]) => {
            const selectedPart = props.dollParts.parts[key]?.find((part) =>
              part.id === id
            );

            return selectedPart
              ? (
                <Image
                  key={id}
                  src={selectedPart.img_frente}
                  width={446}
                  height={669}
                  class={`absolute mobile:h-[323px] mobile:w-[230px] mobile:ml-[18px] ${
                    selectedPart.id === "44" ? "" : "z-[10]"
                  } ${
                    selectedPart.oculto === true
                      ? "hidden"
                      : Number(selectedPart.id_tipo) === 8 // Tipo 8 é o cheiro da boneca
                      ? "hidden"
                      : ""
                  }`}
                />
              )
              : null;
          })}
      </div>
    </>
  );
}
