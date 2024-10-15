import { IconOffersLocal } from "../Icons/IconOffersLocal.tsx";

export function Offers() {
  return (
    <>
      <button class="text-[13px] desk-small:text-[12px] text-base-200 leading-[19px] font-bold flex items-center whitespace-nowrap text-left gap-1">
        <IconOffersLocal />
        Ofertas da <br></br> minha cidade
      </button>
    </>
  );
}
