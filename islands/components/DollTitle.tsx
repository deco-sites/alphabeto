import type { MiniMe } from "../../loaders/MiniMe/minime.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";

/**@title Informações da Mini Me*/
interface Props {
  dollParts: MiniMe;

  step: number;

  /**@title Título da Mini Me*/
  title: string;

  product: ProductDetailsPage | null;
}

export default function DollTitle(props: Props) {

  return (
    <>
      <div>
        <h2 class="font-beccaPerry text-[#676767] text-[44px] mobile:text-[32px] mb-[36px]">
          {props.title}
        </h2>
      </div>
    </>
  );
}
