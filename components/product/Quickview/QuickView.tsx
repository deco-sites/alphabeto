import { Product } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import { JSX } from "preact";
import { useOffer } from "site/sdk/useOffer.ts";
import AddToCartButton from "site/components/product/AddToCartButton.tsx";
import { clx } from "site/sdk/clx.ts";
import Button from "site/components/ui/Button.tsx";
import ProductAgeRangeIndicator from "site/components/product/ProductAgeRangeIndicator.tsx";
import QuikviewHeader from "site/components/product/Quickview/Header.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import { formatPrice } from "site/sdk/format.ts";
import ProductCashback from "site/components/product/Quickview/ProductCashback.tsx";
import ProductDescription from "site/components/product/Quickview/ProductDescription.tsx";
import VariantSelector from "site/components/product/Quickview/ProductVariantSelector.tsx";
import { AppContext as SiteAppContext } from "site/apps/site.ts";
import { AppContext as VtexAppContext } from "apps/vtex/mod.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductImages from "site/components/product/Quickview/ProductImages.tsx";
import OutOfStock from "site/components/product/OutOfStock.tsx";
import { relative } from "site/sdk/url.ts";
export interface ColorItem {
  name: string;
  hexadecimals: string[];
}

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  cardId: string;
  settings: {
    defaultOpen?: boolean;
    cashbackPercentage: number;
    colors: ColorItem[];
  };
}

const script = (id: string) => {
  const card = document.getElementById(id);
  const toogleButton = card?.querySelector<HTMLButtonElement>(
    "#quickviewToogleButton",
  );
  const closeDrawerbutton = card?.querySelector<HTMLButtonElement>(
    "#closeQuickview",
  );
  const drawer = card?.querySelector<HTMLDivElement>("#quickviewProductInfo");
  const delayedSection = card?.querySelector<HTMLDivElement>(
    "#quickviewImages",
  );
  const backdrop = card?.querySelector<HTMLDivElement>("#quickviewBackdrop");
  console.log({ toogleButton, closeDrawerbutton, drawer, delayedSection });
  if (
    !toogleButton || !closeDrawerbutton || !drawer || !delayedSection ||
    !backdrop
  ) {
    return;
  }
  const openDrawer = () => {
    drawer?.classList.remove("translate-x-full");
    drawer?.classList.add("translate-x-0");
    document.body.style.overflow = "hidden";

    backdrop?.classList.remove("hidden", "opacity-0");
    backdrop?.classList.add("block", "opacity-100");

    setTimeout(() => {
      delayedSection?.classList.remove("translate-x-full", "right-0");
      delayedSection?.classList.add("translate-x-0", "right-[375px]");
    }, 300);
  };

  const closeDrawer = () => {
    drawer?.classList.remove("translate-x-0");
    drawer?.classList.add("translate-x-full");
    document.body.style.overflow = "auto";
    backdrop?.classList.remove("block", "opacity-100");
    backdrop?.classList.add("hidden", "opacity-0");

    delayedSection?.classList.remove("translate-x-0", "right-[375px]");
    delayedSection?.classList.add("translate-x-full", "right-0");
  };

  const toggleDrawer = () => {
    if (drawer?.classList.contains("translate-x-full")) {
      openDrawer();
    } else {
      closeDrawer();
    }
  };

  backdrop?.addEventListener("click", closeDrawer);

  toogleButton?.addEventListener("click", toggleDrawer);

  closeDrawerbutton?.addEventListener("click", () => {
    closeDrawer();
  });
};

export interface QuickviewLoaderProps {
  skuId: string;
  cardId: string;
}

export async function loader(
  props: QuickviewLoaderProps,
  _req: Request,
  app: SiteAppContext & VtexAppContext,
): Promise<Props> {
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

function QuickViewDesktop({ product, settings, cardId }: Props) {
  const { offers, isVariantOf, productID, url } = product;
  const productName = isVariantOf?.name ?? product.name;
  const { listPrice, price, seller = "1", installments, availability } =
    useOffer(offers);
  const referenceCode = isVariantOf?.model;
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const isOpen = settings.defaultOpen ?? false;
  const item = mapProductToAnalyticsItem({ product, price, listPrice });

  return (
    <>
      <div className="text-center flex justify-center">
        <Button
          id="quickviewToogleButton"
          class={clx(
            "block w-full",
            "tablet-large:hidden tablet-large:group-hover:block tablet-large:absolute tablet-large:w-[calc(100%_-_28px)] tablet-large:mx-auto tablet-large:top-[min(27dvw,_428px)]",
            "tablet-large:h-11 tablet-large:min-h-11",
          )}
          type="button"
        >
          quickview
        </Button>
      </div>
      <div id="quickviewContent">
        <div
          id="quickviewBackdrop"
          class={clx(
            "fixed top-0 left-0	z-50 h-screen w-screen bg-[#212121] bg-opacity-80 transition-all",
            isOpen ? "block opacity-100" : "hidden opacity-0",
          )}
        />
        {/* Product Info */}
        <div
          id="quickviewProductInfo"
          class={clx(
            "fixed top-0 right-0 z-50 h-screen overflow-y-auto transition-transform bg-white w-[375px]",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <QuikviewHeader />
          <div class="py-10 px-6">
            <ProductAgeRangeIndicator
              product={product}
              class="!text-xs !leading-[18px]"
            />
            {/* Product Name */}
            <p class="text-[20px] font-bold leading-6 text-[#676767] mt-5">
              {productName}
            </p>
            {/* Product Rating */}
            <div class="mt-3 flex gap-4 items-center">
              <ProductRating
                averageRating={product.aggregateRating?.ratingValue ?? 0}
                maxRating={5}
                iconSize={12}
                class="gap-1"
              />
              {/* Reference Code */}
              <p class="text-[#676767] text-xs leading-[14px] font-medium">
                REF: {referenceCode}
              </p>
            </div>
            <div class="my-[30px]">
              {/** Prices */}
              <div class="flex gap-1 items-center">
                {hasListPrice
                  ? (
                    <>
                      <p class="text-[#C5C5C5] text-sm line-through font-bold">
                        {formatPrice(listPrice, offers?.priceCurrency)}
                      </p>
                      <span class="text-primary text-sm leading-4 font-semibold">
                        •
                      </span>
                    </>
                  )
                  : null}
                <strong class="font-bold text-xl text-primary leading-6">
                  {formatPrice(price, offers?.priceCurrency)}
                </strong>
              </div>
              {/** Installments */}
              {installments && (
                <p class="text-[#676767] font-medium text-xs mt-1 leading-[18px]">
                  Em até {installments}
                </p>
              )}
              {/* Cashback */}
              <ProductCashback
                product={product}
                percentage={settings.cashbackPercentage}
              />
            </div>
            {/* Product Description */}
            <ProductDescription product={product} />
            <VariantSelector
              product={product}
              colors={settings.colors}
              cardId={cardId}
            />
            {availability === "https://schema.org/InStock"
              ? (
                <AddToCartButton
                  product={product}
                  seller={seller}
                  item={item}
                />
              )
              : <OutOfStock productID={productID} mode="quickview" />}
            <a
              class="text-primary text-sm underline font-bold mt-5 block text-center"
              href={relative(url ?? "")}
            >
              ver detalhes do produto
            </a>
          </div>
        </div>
        {/* Product Images */}
        <ProductImages
          product={product}
          isOpen={isOpen}
        />
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: useScript(script, cardId),
          }}
        />
      </div>
    </>
  );
}

export default QuickViewDesktop;
