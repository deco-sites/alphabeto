import { AppContext } from "site/apps/site.ts";
import ProductReviews from "site/sections/Product/ProductReviews.tsx";
import { ProductReviewsData } from "site/components/product/ProductReviews/index.tsx";

export interface ReloadProps {
  productId: string;
  actualPage: number;
}

export const loader = async (
  props: ReloadProps,
  req: Request,
  ctx: AppContext,
): Promise<ProductReviewsData> => {
  const formData = await req.formData();
  let actualPage = props.actualPage;
  if (formData.has("operation")) {
    const operation = formData.get("operation")?.toString();
    if (operation === "next") {
      actualPage++;
    } else if (operation === "previous") {
      actualPage--;
    }
  }
  return await ctx.invoke.site.loaders.vtexReviewsAndRatings.index({
    reloadSettings: {
      productID: props.productId,
      sortBy: formData.get("sortBy")?.toString() ?? "SearchDate:desc",
      filterBy: formData.get("filterBy")?.toString() ?? "0",
      actualPage: actualPage.toString(),
    },
  }, req);
};

export default function Reload(props: ProductReviewsData) {
  return <ProductReviews data={props} />;
}
