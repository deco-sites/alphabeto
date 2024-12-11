import { ProductDetailsPage } from "apps/commerce/types.ts";
import ProductCard from "site/components/product/ProductBuyTogether/ProductCard.tsx";
import ProductResume from "site/components/product/ProductBuyTogether/ProductResume.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

export default function ProductBuyTogether(_props: Props) {
  return (
    <>
      <Spacer />
      <div class="bg-[#FDF6ED] flex flex-col pb-5 desk:pb-10">
        <h2 class="font-beccaPerry text-[28px] leading-8 desk:text-[40px] desk:leading-[48px] text-[#212121] font-medium text-center mt-[22px] mb-[30px] desk:my-10">
          Compre junto
        </h2>
        <div class="flex mobile:flex-col container justify-between items-center gap-5 desk:gap-[18px]">
          <div class="mobile:hidden">
            <ProductCard mode="principal" />
          </div>
          <div class="bg-[#F7E0BF] text-primary mobile:hidden rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="plus" size={20} />
          </div>
          <div class="flex gap-4 relative">
            <ProductCard mode="sugestion" />
            <div class="bg-[#F7E0BF] text-primary desk:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[335%] z-10 rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
              <Icon id="plus" size={20} />
            </div>
            <ProductCard mode="sugestion" />
          </div>
          <div class="bg-[#F7E0BF] text-primary rounded-full min-w-10 w-10 h-10 flex items-center justify-center">
            <Icon id="minus" class="hidden desk:block" size={20} />
            <Icon id="equals" class="desk:hidden" size={20} />
          </div>
          <ProductResume />
        </div>
      </div>
    </>
  );
}
