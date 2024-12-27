import { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import Icon from "site/components/ui/Icon.tsx";
import Slider from "site/components/ui/Slider.tsx";
import ProductCard from "site/components/product/ProductCard.tsx";
import { useId } from "site/sdk/useId.ts";
import { ExportedColorItem } from "site/loaders/savedColors.ts";

interface Props {
  products: Product[];
  itemListName?: string;
  colors: ExportedColorItem[];
}

function ProductSlider({ products, itemListName, colors }: Props) {
  const id = useId();

  return (
    <>
      <div
        id={id}
        class="relative"
      >
        <div class="relative z-10">
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
                  itemListName={itemListName}
                  class="tablet-large:max-w-[348px] tablet-large:w-[calc((100dvw_-_144px)_/_4)] w-[calc((100dvw_-_56px)/2)]"
                  colors={colors}
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <div class="absolute mobile:hidden left-10 top-1/2 -translate-y-1/2 z-20">
          <Slider.PrevButton class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group disabled:hidden">
            <Icon id="chevron-right" class="rotate-180 group-hover:hidden" />
            <Icon
              id="arrow-right"
              class="rotate-180 hidden group-hover:block"
            />
          </Slider.PrevButton>
        </div>

        <div class="absolute mobile:hidden right-10 top-1/2 -translate-y-1/2 z-20">
          <Slider.NextButton class="btn btn-neutral btn-outline btn-circle no-animation btn-sm h-10 w-10 bg-white hover:bg-white text-primary hover:text-primary border-none group disabled:hidden">
            <Icon id="chevron-right" class="group-hover:hidden" />
            <Icon
              id="arrow-right"
              class="hidden group-hover:block"
            />
          </Slider.NextButton>
        </div>
      </div>
      <Slider.JS rootId={id} />
    </>
  );
}

export default ProductSlider;
