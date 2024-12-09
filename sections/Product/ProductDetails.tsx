import { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/site.ts";
import ProductImages from "site/components/product/ProductImages.tsx";
import ProductInfo from "site/components/product/ProductInfo.tsx";
import Breadcrumb from "site/components/ui/Breadcrumb.tsx";
import Section from "site/components/ui/Section.tsx";
import { ExportedColorItem } from "site/loaders/savedColors.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";
import ProductShelf, {
  Props as UnavailableShelfProps,
} from "site/sections/Product/ProductShelf.tsx";

export interface PDPSettings {
  cashbackPercentage: number;
  colors: ExportedColorItem[];
  productUnavailableShelf: UnavailableShelfProps;
}

export interface Props {
  /** @title Settings */
  settings: PDPSettings;

  /** @title Ecommerce Plataform Integration Settings */
  page: ProductDetailsPage | null;
}

export async function loader(props: Props, _req: Request, ctx: AppContext) {
  const sizebaySettings = await ctx.invoke.site.loaders.sizebay({
    productUrl: props.page?.product.url,
  });
  return {
    ...props,
    sizebaySettings,
  };
}

export default function ProductDetails({
  page,
  settings,
  sizebaySettings,
}: Awaited<ReturnType<typeof loader>>) {
  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }
  const { availability } = useOffer(page.product.offers);
  const isUnavailable = availability === "https://schema.org/OutOfStock";
  console.log({
    isUnavailable,
    products: settings.productUnavailableShelf.products,
    availability,
  });

  return (
    <div class="container mt-5">
      <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
      <div class="flex mobile:flex-col gap-4 justify-between mobile:relative mt-5">
        <ProductImages page={page} />
        <ProductInfo
          page={page}
          settings={settings}
          sizebaySettings={sizebaySettings}
        />
      </div>
      {isUnavailable && (
        <div id="unavailable-shelf">
          <Spacer />
          <ProductShelf {...settings.productUnavailableShelf} />
        </div>
      )}
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
