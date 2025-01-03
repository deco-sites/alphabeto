import { Product } from "apps/commerce/types.ts";
import { relative } from "site/sdk/url.ts";

interface Props {
  product: Product;
}

export default function ProductDescription({ product }: Props) {
  const { url, description } = product;
  const relativeUrl = relative(url);
  return (
    <div class="h-[54px] relative mt-5 mb-5  tablet-large:mb-[30px] tablet-large:mt-0">
      <p class="text-xs font-medium leading-[18px] text-[#7E7F88] line-clamp-3">
        {description}
      </p>
      <a
        href={relativeUrl}
        class="text-primary font-bold underline absolute text-xs bottom-0 right-0 bg-white p-1 pb-0"
      >
        Veja mais
      </a>
    </div>
  );
}
