import { useSignal } from "@preact/signals";
import { AppContext } from "site/apps/site.ts";
import ProductCard from "site/components/product/ProductBuyTogether/ProductCard.tsx";
import ProductResume from "site/components/product/ProductBuyTogether/ProductResume.tsx";
import {
  BuyTogetgherLoaderProps,
  BuyTogetherLoaderResponse,
  PrincipalProductSignal,
  SugestionProductSignal,
} from "site/components/product/ProductBuyTogether/types.ts";
import Icon from "site/components/ui/Icon.tsx";
import { BuyTogetherInitialProductsResponse } from "site/loaders/BuyTogether/types.ts";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";

export async function loader(
  props: BuyTogetgherLoaderProps,
  _req: Request,
  ctx: AppContext,
): Promise<BuyTogetherLoaderResponse> {
  const { __resolveType, ...propsLoader } = props.buyTogetherInitialLoader;
  const result = (await ctx.invoke(
    // @ts-expect-error This is a dynamic resolved loader
    __resolveType,
    propsLoader,
  )) as BuyTogetherInitialProductsResponse;
  return {
    result,
    newProductsLoader: props.buyTogetherNewProductsLoader,
  };
}

export default function ProductBuyTogether(props: BuyTogetherLoaderResponse) {
  if (!props.result) return null;
  const principalProduct = useSignal<PrincipalProductSignal>({
    product: props.result.principalProduct,
    selectedVariant: props.result.principalProduct.sku,
  });
  const sugestionOne = useSignal<SugestionProductSignal>({
    product: props.result.sugestions[0],
    enabled: true,
    selectedVariant: props.result.sugestions[0].sku,
  });
  const sugestionTwo = useSignal<SugestionProductSignal>({
    product: props.result.sugestions[1],
    enabled: true,
    selectedVariant: props.result.sugestions[1].sku,
  });
  return (
    <>
      <Spacer />
      <div
        class="bg-secondary-content flex flex-col pb-5 desk:pb-10"
        id="buy-together"
      >
        <h2 class="font-beccaPerry text-[28px] leading-8 desk:text-[40px] desk:leading-[48px] text-base-content font-medium text-center mt-[22px] mb-[30px] desk:my-10">
          Compre junto
        </h2>
        <div class="flex mobile:flex-col container justify-between items-center gap-5 desk:gap-[18px]">
          <div class="mobile:hidden">
            <ProductCard mode="principal" signal={principalProduct} />
          </div>
          <div class="bg-secondary text-primary mobile:hidden rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="plus" size={20} />
          </div>
          <div class="flex gap-4 relative">
            <ProductCard
              mode="sugestion"
              signal={sugestionOne}
              newProductsLoader={props.newProductsLoader}
            />
            <div class="bg-secondary text-primary desk:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[335%] z-10 rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
              <Icon id="plus" size={20} />
            </div>
            <ProductCard
              mode="sugestion"
              signal={sugestionTwo}
              newProductsLoader={props.newProductsLoader}
            />
          </div>
          <div class="bg-secondary text-primary rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="equals" size={20} />
          </div>
          <ProductResume
            principalProduct={principalProduct}
            sugestionOne={sugestionOne}
            sugestionTwo={sugestionTwo}
          />
        </div>
      </div>
    </>
  );
}
