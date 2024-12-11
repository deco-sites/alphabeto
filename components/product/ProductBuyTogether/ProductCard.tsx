import { asset } from "$fresh/runtime.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Selector from "site/components/product/ProductBuyTogether/Selector.tsx";
import { useDevice } from "@deco/deco/hooks";

interface Props {
  mode: "principal" | "sugestion";
}
const colors = [
  {
    label: "Azul",
    selected: false,
  },
  {
    label: "Vermelho",
    selected: true,
  },
  {
    label: "Verde",
    selected: false,
  },
  {
    label: "Amarelo",
    selected: false,
  },
];
const tamanhos = [
  {
    label: "Tam. 2",
    selected: false,
  },
  {
    label: "Tam. 4",
    selected: true,
  },
  {
    label: "Tam. 6",
    selected: false,
  },
  {
    label: "Tam. 8",
    selected: false,
  },
];

export default function ProductCard(props: Props) {
  const device = useDevice();
  return (
    <div class="w-[42.67vw] desk:w-[22.78vw] desk:max-w-[328px] flex flex-col">
      <div class="relative w-fit">
        <div class="absolute top-2 left-2 desk:top-4 desk:left-4">
          <div class="relative w-fit">
            <img
              src={asset("/image/DiscountElipse.svg")}
              class="mobile:w-[32px] object-cover"
            />
            <p class="absolute max-w-[34px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-[8px] leading-[8px] desk:text-xs desk:leading-3 text-white text-center">
              20% off
            </p>
          </div>
        </div>
        <Image
          class="rounded-xl desk:max-w-[328px] desk:max-h-[466px] w-full h-full"
          width={328}
          height={466}
          src="https://alphabeto.vtexassets.com/arquivos/ids/380133/61394_macaquinho_vizinhancadivertida--2-.jpg?v=638580431730100000"
        />
        {props.mode === "principal" ? (
          <p class="absolute w-[calc(100%_-_32px)] mx-4 bottom-3.5 text-sm flex gap-2.5 items-center justify-center font-bold text-[#2C2C2C] bg-[#70D1E8] py-2.5 rounded-lg">
            <Icon id="eye" class="min-w-5" size={20} />
            Você está vendo este produto
          </p>
        ) : null}
        {props.mode === "sugestion" ? (
          <div class="absolute top-2.5 right-2.5 desk:top-3.5 desk:right-3.5 flex flex-col gap-2.5 desk:gap-3.5">
            <button class="h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-[#FDF6ED] text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)]">
              <Icon
                id="refresh"
                size={device === "desktop" ? 20 : 15}
                strokeWidth={device === "desktop" ? 2 : 4}
              />
            </button>
            <button class="h-[30px] w-[30px] desk:h-10 desk:w-10 flex items-center justify-center bg-white rounded-full hover:bg-[#FDF6ED] text-[#FF859A] shadow-[0px_2px_10px_rgba(59,59,59,0.1)]">
              <Icon
                id="close"
                size={device === "desktop" ? 20 : 15}
                strokeWidth={device === "desktop" ? 2 : 4}
              />
            </button>
          </div>
        ) : null}
      </div>
      <p class="text-[#676767] font-bold text-xs mobile:leading-[18px] desk:text-sm mt-1 desk:mt-2.5">
        Calça Infantil Menina Estampa Monstrinhos Quadradinhos - Tam. 2 a 12
        anos - Azaleia
      </p>
      <div>
        <div class="flex items-center mt-2.5 desk:mt-5">
          <p class="font-bold text-xs leading-[18px] text-[#C5C5C5] line-through">
            R$ 150,35
          </p>
          <p class="text-primary text-xs leading-[14px] mx-1.5">•</p>
          <p class="font-bold text-primary text-sm mobile:leading-4">
            R$ 125,35
          </p>
        </div>
        <p class="text-[#676767] text-xs leading-[18px] font-medium mt-1 mobile:h-9">
          Em até 10x sem juros
        </p>
        <div class="grid grid-cols-[1fr_98px] gap-1.5 mobile:flex mobile:flex-col mobile:gap-2.5 mt-1 desk:mt-5">
          <Selector values={colors} placeholder="Selecione uma cor" />
          <Selector values={tamanhos} placeholder="Selecione um tamanho" />
        </div>
      </div>
    </div>
  );
}
