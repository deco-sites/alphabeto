import { useScript } from "@deco/deco/hooks";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import OutOfStock from "site/components/product/OutOfStock.tsx";
import ProductAgeRangeIndicator from "site/components/product/ProductAgeRangeIndicator.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import AddToCartButton from "site/components/product/Quickview/AddToCartButton.tsx";
import QuikviewHeader from "site/components/product/Quickview/Header.tsx";
import ProductCashback from "site/components/product/Quickview/ProductCashback.tsx";
import ProductDescription from "site/components/product/Quickview/ProductDescription.tsx";
import ProductImages from "site/components/product/Quickview/ProductImages.tsx";
import VariantSelector from "site/components/product/Quickview/ProductVariantSelector.tsx";
import { QuickViewProps } from "site/components/product/Quickview/QuickView.tsx";
import Button from "site/components/ui/Button.tsx";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";
import { relative } from "site/sdk/url.ts";
import { useOffer } from "site/sdk/useOffer.ts";

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
  card?.addEventListener("closeQuickview", () => {
    closeDrawer();
  });
};

function QuickViewDesktop({ product, settings, cardId }: QuickViewProps) {
  const { offers, isVariantOf, productID, url } = product;
  const productName = isVariantOf?.name ?? product.name;
  const { listPrice, price, seller = "1", installments, availability } =
    useOffer(offers);
  const referenceCode = isVariantOf?.model;
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const isOpen = settings.defaultOpen ?? false;
  const item = mapProductToAnalyticsItem({ product, price, listPrice });

  return (
    <div>
      <div className="text-center flex justify-center">
        <Button
          id="quickviewToogleButton"
          class={clx(
            "hidden group-hover:block absolute w-[calc(100%_-_28px)] mx-auto top-[min(27dvw,_428px)]",
            "h-11 min-h-11",
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
            "fixed top-0 left-0	z-50 h-screen w-screen bg-base-content bg-opacity-80 transition-all",
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
            <p class="text-[20px] font-bold leading-6 text-accent mt-5">
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
              <p class="text-accent text-xs leading-[14px] font-medium">
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
                <p class="text-accent font-medium text-xs mt-1 leading-[18px]">
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
                  cardId={cardId}
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
    </div>
  );
}

export default QuickViewDesktop;
