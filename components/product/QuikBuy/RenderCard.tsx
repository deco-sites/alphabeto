import { Props as ProductCardProps } from "site/components/product/ProductCard.tsx";
import { AppContext as SiteAppContext } from "site/apps/site.ts";
import { AppContext as VtexAppContext } from "apps/vtex/mod.ts";
import { EXTENSIONS } from "site/loaders/BuyTogether/constants.ts";

type AppContext = SiteAppContext & VtexAppContext;

export type OptimizedProductCard = Omit<
  ProductCardProps,
  "product" | "settings"
>;

export interface ActionProps {
  skuId: string;
  productCardProps: OptimizedProductCard;
}

export async function action(
  props: ActionProps,
  _req: Request,
  ctx: AppContext,
): Promise<ProductCardProps> {
  const globalSettings = await ctx.invoke.site.loaders.getGlobalSettings({});
  const shelfSettings = {
    colors: globalSettings.colors,
    cashbackPercentage: globalSettings.cashbackPercentage,
  };
  const products = await ctx.invoke.vtex.loaders.intelligentSearch.productList({
    props: {
      ids: [props.skuId],
    },
  });
  if (products == null || products.length === 0) {
    throw new Error("Product not found");
  }
  const [product] = await ctx.invoke.vtex.loaders.product.extend({
    products: [products[0]],
    ...EXTENSIONS,
  });
  return {
    ...props.productCardProps,
    lozad: false,
    settings: shelfSettings,
    product: product,
  };
}

export { default } from "site/components/product/ProductCard.tsx";
