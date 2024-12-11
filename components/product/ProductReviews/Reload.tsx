import { AppContext } from "site/apps/site.ts";
import { VtexReviewsLoader } from "site/loaders/vtexReviewsAndRatings/index.ts";
import ProductReviews from "site/sections/Product/ProductReviews.tsx";
import { ProductReviewsData } from "site/components/product/ProductReviews/index.tsx";

export const loader = async (
  props: VtexReviewsLoader,
  req: Request,
  ctx: AppContext
): Promise<ProductReviewsData> => {
  return await ctx.invoke.site.loaders.vtexReviewsAndRatings.index(props, req);
};

export default function Reload(props: ProductReviewsData) {
  return <ProductReviews data={props} />;
}
