import type { MiniMe, PartType } from "../../loaders/MiniMe/minime.ts";
import { useRef } from "preact/hooks";
import { Signal } from "@preact/signals";
import Icon from "site/components/ui/Icon.tsx";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  selectedParts: Signal<{ [key: string]: string }>;

  type: PartType;
}

export default function DollParts(props: Props) {
  const storeData = localStorage.getItem('selectedParts')
  props.selectedParts.value = storeData ? JSON.parse(storeData) : {}

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollQtd = 250;

  const scrollItems = (side: string) => {
    if (scrollContainerRef.current) {
      if (side === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollQtd,
          behavior: "smooth",
        });
      } else if (side === "right") {
        scrollContainerRef.current.scrollBy({
          left: +scrollQtd,
          behavior: "smooth",
        });
      }
    }
  };

  const selectImage = (id: string) => {
    props.selectedParts.value = { ...props.selectedParts?.value, [props.type.nome]: id }
    localStorage.setItem('selectedParts', JSON.stringify(props.selectedParts))
  }

  return (
    <>
      <div class="mb-[36px]">
        <div
          ref={scrollContainerRef}
          class="flex mobile:overflow-scroll overflow-hidden max-w-[773px] h-[370px] mobile:h-[232px] w-full items-center"
        >
          <div class="flex items-center">
            {props.type &&
              props.dollParts.parts[props.type.nome].map((part) => (
                <>
                  <div
                    onClick={() => selectImage(part.id)}
                    class={Object.values(props.selectedParts.value).includes(part.id)
                      ? `flex flex-col items-center w-[138px] h-[237px] mr-[4px] bg-[#fff] rounded-[8px] border-[1px] border-[#D6DE23]`
                      : `flex flex-col items-center w-[138px] h-[237px] mr-[4px] rounded-[8px] cursor-pointer hover:rounded-[8px] transition duration-300 hover:border-[0.5px] hover:border-[#D6DE23]`}
                  >
                    <img
                      class="mobile:w-[97px] mobile:h-[158px]"
                      src={part.img_frente}
                    />
                    <p class="font-Quicksand text-[#7E7F88] text-[16px] mobile:text-[12px] text-center">
                      {part.id}
                    </p>
                  </div>
                </>
              ))} 
          </div>
        </div>
        <button
          onClick={() => scrollItems("left")}
          class="flex items-center justify-center absolute mobile:bottom-[50px] left-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full rotate-[180deg] p-[12px]"
        >
          <Icon id="simple-arrow-right" />
        </button>
        <button
          onClick={() => scrollItems("right")}
          class="flex items-center justify-center absolute mobile:bottom-[50px] right-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full p-[12px]"
        >
          <Icon id="simple-arrow-right" />
        </button>
      </div>
    </>
  );
}
