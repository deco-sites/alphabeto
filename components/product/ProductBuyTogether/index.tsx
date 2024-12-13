import { Resolved } from "@deco/deco";
import { useScriptAsDataURI } from "@deco/deco/hooks";
import { AppContext } from "site/apps/site.ts";
import ProductCard from "site/components/product/ProductBuyTogether/ProductCard.tsx";
import ProductResume from "site/components/product/ProductBuyTogether/ProductResume.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { BuyTogetherResponse } from "site/loaders/buyTogether.ts";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";
import { createAndLoadSDK } from "site/components/product/ProductBuyTogether/sdk.tsx";
import { MINICART_DRAWER_ID } from "site/constants.ts";

interface Props {
  buyTogetherLoader: Resolved<BuyTogetherResponse>;
}

export async function loader(props: Props, _req: Request, ctx: AppContext) {
  const { __resolveType, ...propsLoader } = props.buyTogetherLoader;
  const result = (await ctx.invoke(
    // @ts-expect-error This is a dynamic resolved loader
    __resolveType,
    propsLoader
  )) as BuyTogetherResponse;
  return {
    result,
    buyTogetherLoader: props.buyTogetherLoader,
  };
}

export default function ProductBuyTogether(
  props: Awaited<ReturnType<typeof loader>>
) {
  if (!props.result) return null;
  const principalProduct = props.result.principalProduct;
  const sugestionOne = props.result.sugestions[0];
  const sugestionTwo = props.result.sugestions[1];
  return (
    <>
      <Spacer />
      <script src={useScriptAsDataURI(createAndLoadSDK, MINICART_DRAWER_ID)} />
      <div class="bg-[#FDF6ED] flex flex-col pb-5 desk:pb-10" id="buy-together">
        <h2 class="font-beccaPerry text-[28px] leading-8 desk:text-[40px] desk:leading-[48px] text-[#212121] font-medium text-center mt-[22px] mb-[30px] desk:my-10">
          Compre junto
        </h2>
        <div class="flex mobile:flex-col container justify-between items-center gap-5 desk:gap-[18px]">
          <div class="mobile:hidden">
            <ProductCard
              mode="principal"
              product={principalProduct}
              buyTogetherLoader={props.buyTogetherLoader}
              itemNameId="principal-product"
            />
          </div>
          <div class="bg-[#F7E0BF] text-primary mobile:hidden rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="plus" size={20} />
          </div>
          <div class="flex gap-4 relative">
            <ProductCard
              mode="sugestion"
              product={sugestionOne}
              buyTogetherLoader={props.buyTogetherLoader}
              itemNameId="sugestion-one"
            />
            <div class="bg-[#F7E0BF] text-primary desk:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[335%] z-10 rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
              <Icon id="plus" size={20} />
            </div>
            <ProductCard
              mode="sugestion"
              product={sugestionTwo}
              buyTogetherLoader={props.buyTogetherLoader}
              itemNameId="sugestion-two"
            />
          </div>
          <div class="bg-[#F7E0BF] text-primary rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="equals" size={20} />
          </div>
          <ProductResume />
        </div>
      </div>
    </>
  );
}
