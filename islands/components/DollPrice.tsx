import { ProductDetailsPage } from "apps/commerce/types.ts";

interface Props {
  product: ProductDetailsPage | null;
}

export default function DollPrice(props: Props) {

    const installments = 3;
    const price = props.product?.product.offers?.offers[0].price;
    const priceDivided = price ? price / installments : price; 

    return (
    <>
      <div class="flex flex-col mobile:items-center justify-start mobile:justify-center w-full mobile:mb-[20px]">
        <h3 class="font-Quicksand font-bold text-[26px] mobile:text-[18px] text-[#676767]">
          Total: <b class="text-[#FF8300]">R$ {JSON.stringify(price).replace(".", ",")}</b>
        </h3>
        <p class="font-Quicksand text-[#7E7F88] mobile:text-[12px]">
          Em até {installments}x R$ {priceDivided?.toFixed(2).replace(".", ",")} sem juros
        </p>
      </div>
    </>
  );
}
