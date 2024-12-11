import Image from "apps/website/components/Image.tsx";
import Button from "site/components/ui/Button.tsx";

export default function ProductResume() {
  return (
    <div class="flex flex-col mobile:items-center gap-2.5 max-w-[335px] mobile:mx-auto rounded-lg desk:max-w-[209px] desk:w-[209px] mobile:bg-white mobile:px-3 py-5">
      <div class="grid grid-cols-3 desk:hidden gap-1.5 items-end justify-center w-fit pb-0.5">
        <div class="flex flex-col gap-0.5 w-fit">
          <p class="text-primary max-w-[101px] text-xs leading-[18px] font-bold text-center">
            Você está vendo este produto
          </p>
          <div class="border-2 border-[#D6DE23] rounded w-fit">
            <Image
              class="rounded max-w-[90px] max-h-[134px] w-full h-full aspect-[90/134]"
              width={90}
              height={134}
              src="https://alphabeto.vtexassets.com/arquivos/ids/380133/61394_macaquinho_vizinhancadivertida--2-.jpg?v=638580431730100000"
            />
          </div>
        </div>
        <div class="border-2 border-transparent w-fit">
          <Image
            class="rounded max-w-[90px] max-h-[134px] w-full h-full mx-1 aspect-[90/134]"
            width={90}
            height={134}
            src="https://alphabeto.vtexassets.com/arquivos/ids/380133/61394_macaquinho_vizinhancadivertida--2-.jpg?v=638580431730100000"
          />
        </div>
        <div class="border-2 border-transparent w-fit">
          <Image
            class="rounded max-w-[90px] max-h-[134px] w-full h-full mx-1 aspect-[90/134]"
            width={90}
            height={134}
            src="https://alphabeto.vtexassets.com/arquivos/ids/380133/61394_macaquinho_vizinhancadivertida--2-.jpg?v=638580431730100000"
          />
        </div>
      </div>
      <p class="text-base-300 text-sm font-bold text-center desk:max-w-[136px] mx-auto">
        Compre junto mais 2 produtos por:
      </p>
      <p class="text-primary text-xl font-bold leading-6 text-center">
        R$ 123,70
      </p>
      <Button class="h-11 w-[237px] desk:w-full">Compre junto</Button>
    </div>
  );
}
