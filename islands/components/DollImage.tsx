import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import type { MiniMe, PartType } from "../../loaders/MiniMe/minime.ts";
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
  const deleteDoll = () => {
    localStorage.removeItem("selectedParts");
    localStorage.removeItem("step");

    props.selectedParts.value = {};
    props.step.value = 0;
  };

  console.log(props.image);

  const turnDoll = () => {
  };

  return (
    <>
      <section class="relative mr-[30px] mobile:mb-[120px] px-[55px] py-[33px] mobile:px-[30px] mobile:py-[15px] bg-[#fff] border-dashed border-[1px] border-[#FF3800] rounded-[8px] max-w-[557px] h-[835px] mobile:h-[520px] w-full">
        <button
          onClick={turnDoll}
          class="absolute top-[15px] right-[15px] w-[50px] h-[60px] p-[8px] bg-[#F7E0BF] rounded-[8px]"
        >
          <div class="flex flex-col items-center font-Quicksand text-[12px] text-[#FF8300] font-bold">
            <Icon id="turn-doll" />Virar
          </div>
        </button>
        <button
          onClick={deleteDoll}
          class="absolute top-[100px] right-[15px] w-[50px] h-[60px] p-[8px] bg-[#F5F4F1] rounded-[8px]"
        >
          <div class="flex flex-col items-center font-Quicksand text-[12px] text-[#676767] font-bold">
            <Icon id="delete-doll" />Excluir
          </div>
        </button>
        {Object.keys(props.selectedParts.value).length > 0
          ? (
            Object.entries(props.selectedParts.value).map(([key, id]) => {
              const selectedPart = props.dollParts.parts[key]?.find((
                part,
              ) => part.id === id);

              console.log(selectedPart);

              return selectedPart
                ? (
                  <Image
                    key={id}
                    src={selectedPart.img_frente}
                    width={446}
                    height={669}
                    class={`absolute mobile:top-0 mobile:left-0 ${
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
            })
          )
          : (
            <Image
              src={props.image}
              width={446}
              height={669}
            />
          )}
      </section>
    </>
  );
}
