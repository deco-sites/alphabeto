import { ProductDetailsPage } from "apps/commerce/types.ts";
import ProductImages from "site/components/product/ProductImages.tsx";
import ProductInfo from "site/components/product/ProductInfo.tsx";
import Breadcrumb from "site/components/ui/Breadcrumb.tsx";
import Section from "site/components/ui/Section.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

export default function ProductDetails({ page }: Props) {
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

  return (
    <div class="container">
      <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />
      <div class="flex mobile:flex-col gap-4 justify-between">
        <ProductImages page={page} />
        <ProductInfo page={page} />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
