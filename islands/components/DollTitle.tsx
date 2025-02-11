import type { DollTypes } from "../../loaders/MiniMe/minime.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { useEffect, useState } from "preact/hooks";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: DollTypes;
  partSelected: DollTypes[];

  /**@title Título da Mini Me*/
  title: string;

  page: ProductDetailsPage | null;
}

export default function DollTitle(props: Props) {
    const [stepCount, setStepCount] = useState(Number(localStorage.getItem('step')));
    const [stepSelectedCount, setStepSelectedCount] = useState(localStorage.getItem('selectedStep') || "pele");

  return (
    <>
      <div>
        <h2 class="font-beccaPerry text-[#676767] text-[44px] mobile:text-[32px] mb-[36px]">
          {props.title}
        </h2>
      </div>
      <div class="flex items-center relative mb-[36px] w-full">
        {Object.keys(props.dollParts).map((i, index) => (
          <>
            <p
              class={stepCount >= index
                ? `font-Quicksand bg-[#D6DE23] w-[40px] h-[40px] text-[20px] text-[#F98300] py-[4px] px-[14px] rounded-[50%] font-bold`
                : `text-[#C5C5C5] bg-[#F5F4F1] font-Quicksand w-[40px] h-[40px] text-[20px] py-[4px] px-[14px] rounded-[50%] font-bold`}
            >
              {`${index + 1}`}
            </p>
            {index !== Object.keys(props.dollParts).length - 1 && (
              <hr
                class={stepCount >= index
                  ? `border-dashed border-b-[1px] w-[80px] border-[#F98300]`
                  : `border-dashed border-b-[1px] w-[80px] border-[#C5C5C5]`}
              />
            )}
          </>
        ))}
      </div>

    </>
  );
}
