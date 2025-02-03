import { useDevice } from "@deco/deco/hooks";
import { Product } from "apps/commerce/types.ts";
import { AppContext as VtexAppContext } from "apps/vtex/mod.ts";
import { AppContext as SiteAppContext, ColorItem } from "site/apps/site.ts";
import QuickViewDesktop from "site/components/product/Quickview/QuickViewDesktop.tsx";
import QuickViewMobile from "site/islands/Quickview/QuickViewMobile.tsx";

export interface QuickViewProps {
  product: Product;
  cardId: string;
  settings: {
    defaultOpen?: boolean;
    cashbackPercentage: number;
    colors: ColorItem[];
  };
}

export interface QuickviewLoaderProps {
  skuId: string;
  cardId: string;
}

export async function loader(
  props: QuickviewLoaderProps,
  _req: Request,
  app: SiteAppContext & VtexAppContext,
): Promise<QuickViewProps> {
  const { skuId, cardId } = props;
  const productList = await app.invoke.vtex.loaders.intelligentSearch
    .productList({
      props: {
        ids: [skuId],
      },
    });
  const product = productList?.at(0);
  if (!product) {
    throw new Error("Loader Error: Product not found");
  }
  const [extendedProduct] = await app.invoke.vtex.loaders.product.extend({
    reviews: true,
    products: [product],
  });
  const siteSettings = {
    colors: app.globalSettings.colors,
    cashbackPercentage: app.globalSettings.cashbackPercentage,
  };

  return {
    product: extendedProduct,
    cardId,
    settings: {
      colors: siteSettings.colors,
      cashbackPercentage: siteSettings.cashbackPercentage,
      defaultOpen: true,
    },
  };
}
export default function QuickView(props: QuickViewProps) {
  const device = useDevice();
  const isLargeDevice = device === "desktop" || device === "tablet";

  if (isLargeDevice) {
    return <QuickViewDesktop {...props} />;
  } else {
    return <QuickViewMobile {...props} />;
  }
}
