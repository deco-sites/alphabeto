import type { PartType } from "../../loaders/MiniMe/minime.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

/**@title Informações da Mini Me*/
interface Props {
  types: PartType[];

  step: number;
}

export default function DollProgress(props: Props) {

  return (
    <>
      <div class="flex items-center relative mb-[36px] w-full">
        {Object.keys(props.types).map((_i, index) => (
          <>
            <p
              class={props.step >= index
                ? `font-Quicksand bg-[#D6DE23] w-[40px] h-[40px] text-[20px] text-[#F98300] py-[4px] px-[14px] rounded-[50%] font-bold`
                : `text-[#C5C5C5] bg-[#F5F4F1] font-Quicksand w-[40px] h-[40px] text-[20px] py-[4px] px-[14px] rounded-[50%] font-bold`}
            >
              {`${index + 1}`}
            </p>
            {index !== Object.keys(props.types).length - 1 && (
              <hr
                class={props.step >= index
                  ? `border-dashed border-b-[1px] w-[80px] border-[#F98300]`
                  : `border-dashed border-b-[1px] w-[80px] border-[#C5C5C5]`}
              />
            )}
          </>
        ))}
      </div>
      {props.types[props.step] && (
        <div class="flex items-center">
          <p class="font-beccaPerry text-[32px] mobile:text-[25px] text-[#FF8300]">
            Passo {props.types[props.step].ordem}:
          </p>
          <p class="font-Quicksand text-[20px] mobile:text-[16px] text-[#7E7F88] font-bold ml-[4px]">
            {props.types[props.step].titulo}
          </p>
        </div>
      )}
    </>
  );
}
