import { useDevice } from "@deco/deco/hooks";
import { Product } from "apps/commerce/types.ts";
import { groupArrayItens } from "../../../sdk/arrayUtils.ts";
import { clx } from "../../../sdk/clx.ts";
import { useId } from "../../../sdk/useId.ts";
import Slider from "../../ui/Slider.tsx";
import ProductCardSearch from "./ProductCardSearch.tsx";
interface Props {
  products: Product[];
}

export default function RenderProductsResults({ products }: Props) {
  const device = useDevice();
  if (device === "desktop") {
    return <ul class="grid grid-cols-2 w-fit gap-y-[25px] gap-x-[57px]">{products ? products.map((product, index) => <ProductCardSearch product={product} index={index} itemListName="Suggeestions" />) : null}</ul>;
  }
  const groupedProducts = groupArrayItens(products, 2);
  const sliderId = useId();
  return (
    <div id={sliderId}>
      <Slider class="carousel w-[calc(100vw_-_40px)] carousel-center gap-6">
        {groupedProducts.map((group, index) => (
          <Slider.Item index={index} key={index} class="carousel-item w-full">
            <ul class="flex flex-col gap-6">
              {group.map((product, index) => (
                <ProductCardSearch product={product} index={index} itemListName="Suggeestions" />
              ))}
            </ul>
          </Slider.Item>
        ))}
      </Slider>
      <ul class={clx("carousel flex justify-center gap-1 mt-10 w-full")}>
        {groupedProducts.length > 1 &&
          groupedProducts.map((_, index) => (
            <li class="carousel-item">
              <Slider.Dot index={index} class={clx("bg-secondary h-2 w-2 no-animation rounded-full", "disabled:w-[30px] disabled:bg-primary  transition-[background-color,_width]")}></Slider.Dot>
            </li>
          ))}
      </ul>
      <Slider.JS rootId={sliderId} />
    </div>
  );
}
