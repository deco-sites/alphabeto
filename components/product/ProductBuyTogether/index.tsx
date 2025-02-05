import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { AppContext } from "site/apps/site.ts";
import ProductCard from "site/components/product/ProductBuyTogether/ProductCard.tsx";
import ProductResume from "site/components/product/ProductBuyTogether/ProductResume.tsx";
import {
  BuyTogetgherLoaderProps,
  PrincipalProductSignal,
  SugestionProductSignal,
} from "site/components/product/ProductBuyTogether/types.ts";
import Icon from "site/components/ui/Icon.tsx";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";

export async function loader(
  props: BuyTogetgherLoaderProps,
  _req: Request,
  ctx: AppContext,
) {
  return await ctx.invoke.site.loaders.BuyTogether.getInitialProducts(props);
}

interface EventDetail extends CustomEvent {
  detail: {
    url: string;
  };
}

export default function ProductBuyTogether(
  props: Awaited<ReturnType<typeof loader>>,
) {
  if (!props) return null;
  const principalProduct = useSignal<PrincipalProductSignal>({
    product: props.principalProduct,
    selectedVariant: props.principalProduct.sku,
  });
  const sugestionOne = useSignal<SugestionProductSignal>({
    product: props.sugestions[0],
    enabled: true,
    selectedVariant: props.sugestions[0].sku,
  });
  const sugestionTwo = useSignal<SugestionProductSignal>({
    product: props.sugestions[1],
    enabled: true,
    selectedVariant: props.sugestions[1].sku,
  });
  const notReloadThisProducts = [
    principalProduct.value.product.isVariantOf?.productGroupID ?? "",
    sugestionOne.value.product.isVariantOf?.productGroupID ?? "",
    sugestionTwo.value.product.isVariantOf?.productGroupID ?? "",
  ];

  useEffect(() => {
    const pdpChangeUrl = (event: Event) => {
      const ev = event as EventDetail;
      const urlParams = new URL(ev.detail.url, "http://localhost");
      const sku = urlParams.searchParams.get("skuId");

      if (!sku) return;
      principalProduct.value = {
        ...principalProduct.value,
        selectedVariant: sku,
      };
    };
    globalThis.addEventListener("skuChange", pdpChangeUrl);

    return () => {
      globalThis.removeEventListener("skuChange", pdpChangeUrl);
    };
  }, [principalProduct]);

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
              enableRefresh={props.enableRefresh}
              newProductLoaderData={{
                ...props.newProductLoaderData,
                notShowProductsIds: notReloadThisProducts,
              }}
            />
            <div class="bg-secondary text-primary desk:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[335%] z-10 rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
              <Icon id="plus" size={20} />
            </div>
            <ProductCard
              mode="sugestion"
              signal={sugestionTwo}
              enableRefresh={props.enableRefresh}
              newProductLoaderData={{
                ...props.newProductLoaderData,
                notShowProductsIds: notReloadThisProducts,
              }}
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

export function LoadingFallback() {
  return (
    <div class="flex justify-center items-center h-[142.130987vw] desk:h-[min(64.5833vw,_930px)]">
      <span class="loading loading-spinner" />
    </div>
  );
}
