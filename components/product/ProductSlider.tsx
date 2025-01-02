import { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import Icon from "site/components/ui/Icon.tsx";
import Slider from "site/components/ui/Slider.tsx";
import ProductCard from "site/components/product/ProductCard.tsx";
import { useId } from "site/sdk/useId.ts";
import { useDevice } from "@deco/deco/hooks";
import { ColorItem } from "site/apps/site.ts";

export interface ProductSliderProps {
  products: Product[] | null;
  /**
   * @title List Name for Analytics
   */
  viewItemListName?: string;
  settings: {
    colors: ColorItem[];
    cashbackPercentage: number;
  };
}

const DESKTOP_ITENS = 4;
const TABLET_ITENS = 2;

function ProductSlider(
  { products, viewItemListName, settings }: ProductSliderProps,
) {
  if (!products || products.length === 0) return null;
  const id = useId();
  const device = useDevice();
  const items = device === "desktop" ? DESKTOP_ITENS : TABLET_ITENS;
  const pages = Math.ceil(products.length / items);
  const pagesArray = Array.from({ length: pages }, (_, i) => i);

  return (
    <>
      <div
        id={id}
        class="relative"
      >
        <div class="relative">
          <Slider
            class="carousel"
            style={{
              maxWidth: "100%",
              gap: "16px",
            }}
          >
            {products?.map((product, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item",
                )}
              >
                <ProductCard
                  index={index}
                  product={product}
                  itemListName={viewItemListName}
                  class="tablet-large:max-w-[348px] tablet-large:w-[calc((100dvw_-_144px)_/_4)] w-[calc((100dvw_-_56px)/2)]"
                  settings={settings}
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="absolute mobile:hidden top-[min(14.7916vw,_230.30px)] -left-5 z-20">
          <Slider.PrevButton class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group disabled:hidden">
            <Icon id="chevron-right" class="rotate-180 group-hover:hidden" />
            <Icon
              id="arrow-right"
              class="rotate-180 hidden group-hover:block"
            />
          </Slider.PrevButton>
        </div>

        <div class="absolute mobile:hidden top-[min(14.7916vw,_230.30px)] -right-5 z-20">
          <Slider.NextButton class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group disabled:hidden">
            <Icon id="chevron-right" class="group-hover:hidden" />
            <Icon
              id="arrow-right"
              class="hidden group-hover:block"
            />
          </Slider.NextButton>
        </div>
        <ul class="carousel w-full gap-1 justify-center mt-10">
          {pagesArray.map((_, index) => (
            <li class="carousel-item">
              <Slider.Dot
                index={index * items}
                class={clx(
                  "bg-secondary h-[8px] w-[8px] no-animation rounded-full",
                  "disabled:w-[30px] disabled:bg-primary transition-[width]",
                )}
              >
              </Slider.Dot>
            </li>
          ))}
        </ul>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
