import { useSignal } from "@preact/signals";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductAgeRangeIndicator from "site/components/product/ProductAgeRangeIndicator.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import ProductCashback from "site/components/product/Quickview/ProductCashback.tsx";
import ProductDescription from "site/components/product/Quickview/ProductDescription.tsx";
import { QuickViewProps } from "site/components/product/Quickview/QuickView.tsx";
import Button from "site/components/ui/Button.tsx";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";
import { relative } from "site/sdk/url.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import AddToCartButton from "./AddToCartButton.tsx";
import QuikviewHeader from "./Header.tsx";
import VariantSelector from "./ProductVariantSelector.tsx";

// const script = (id: string) => {
//   const card = document.getElementById(id);
//   const toogleButton = card?.querySelector<HTMLButtonElement>(
//     "#quickviewToogleButton",
//   );
//   const closeDrawerbutton = card?.querySelector<HTMLButtonElement>(
//     "#closeQuickview",
//   );
//   const drawer = card?.querySelector<HTMLDivElement>("#quickviewProductInfo");
//   const backdrop = card?.querySelector<HTMLDivElement>("#quickviewBackdrop");
//   if (
//     !toogleButton || !closeDrawerbutton || !drawer ||
//     !backdrop
//   ) {
//     return;
//   }
//   const openDrawer = () => {
//     drawer?.classList.remove("translate-y-full");
//     drawer?.classList.add("translate-y-0");
//     document.body.style.overflow = "hidden";

//     backdrop?.classList.remove("hidden", "opacity-0");
//     backdrop?.classList.add("block", "opacity-100");
//   };

//   const closeDrawer = () => {
//     drawer?.classList.remove("translate-y-0");
//     drawer?.classList.add("translate-y-full");
//     document.body.style.overflow = "auto";
//     backdrop?.classList.remove("block", "opacity-100");
//     backdrop?.classList.add("hidden", "opacity-0");
//   };

//   const toggleDrawer = () => {
//     if (drawer?.classList.contains("translate-y-full")) {
//       openDrawer();
//     } else {
//       closeDrawer();
//     }
//   };

//   backdrop?.addEventListener("click", closeDrawer);

//   toogleButton?.addEventListener("click", toggleDrawer);

//   closeDrawerbutton?.addEventListener("click", () => {
//     closeDrawer();
//   });
//   card?.addEventListener("closeQuickview", () => {
//     closeDrawer();
//   });
// };

function QuickViewMobile(
  { product, settings, cardId }: QuickViewProps,
) {
  const { offers, productID, url } = product;
  const isOpen = useSignal(settings.defaultOpen ?? false);
  const skuSignal = useSignal(productID);
  const isVariantOf = product.isVariantOf?.hasVariant.find(
    (variant) => variant.sku === skuSignal.value,
  );
  const { image } = isVariantOf ?? product;
  const productName = product.isVariantOf?.name ?? product.name;
  const { listPrice, price, seller = "1", installments, availability } =
    useOffer(offers);
  const referenceCode = product.isVariantOf?.model;
  const hasListPrice = listPrice && listPrice > (price ?? 0);
  const item = mapProductToAnalyticsItem({
    product: isVariantOf ?? product,
    price,
    listPrice,
  });
  const [front] = image ?? [];

  return (
    <div class="mt-auto pt-2.5">
      <div className="text-center flex justify-center">
        <Button
          onClick={() => isOpen.value = !isOpen.value}
          id="quickviewToogleButton"
          class={clx(
            "block w-full h-11 min-h-11",
          )}
          type="button"
        >
          Veja Agora
        </Button>
      </div>
      {isOpen.value
        ? (
          <div id="quickviewContent">
            <div
              id="quickviewBackdrop"
              class={clx(
                "fixed top-0 left-0	z-50 h-screen w-screen bg-base-content bg-opacity-80",
                "block",
              )}
            />
            {/* Product Info */}
            <div
              id="quickviewProductInfo"
              class={clx(
                "fixed left-0 bottom-0 z-50 h-full max-h-[656px] overflow-y-auto bg-white w-vw rounded-t-lg",
                "translate-y-0",
              )}
            >
              <QuikviewHeader onClick={() => isOpen.value = false} />
              <div class="py-5 px-6">
                <div class="flex gap-1.5">
                  <VTEXImageTag
                    src={front?.url ?? ""}
                    alt={productName}
                    width={160}
                    class="aspect-[160/262] rounded-lg max-h-[262px] object-cover"
                    forceSrcWidth={160}
                  />
                  <div class="flex flex-col justify-between">
                    <div>
                      <ProductAgeRangeIndicator
                        product={product}
                        class="!text-xs !leading-[18px]"
                      />
                      {/* Product Name */}
                      <p class="text-[14px] font-bold leading-4 text-accent mt-2.5">
                        {productName}
                      </p>
                      {/* Product Rating */}
                      <div class="mt-3 flex gap-4 items-center">
                        <ProductRating
                          averageRating={product.aggregateRating?.ratingValue ??
                            0}
                          maxRating={5}
                          iconSize={8}
                          class="gap-1"
                        />
                        {/* Reference Code */}
                        <p class="text-accent text-xs leading-[14px] font-medium">
                          REF: {referenceCode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        {/** Prices */}
                        <div class="flex gap-1 items-center">
                          {hasListPrice
                            ? (
                              <>
                                <p class="text-[#C5C5C5] text-[12px] leading-[14px] line-through font-bold">
                                  {formatPrice(
                                    listPrice,
                                    offers?.priceCurrency,
                                  )}
                                </p>
                                <span class="text-primary text-sm leading-4 font-semibold">
                                  •
                                </span>
                              </>
                            )
                            : null}
                          <strong class="font-bold text-sm text-primary leading-4">
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
                    </div>
                  </div>
                </div>
                {/* Product Description */}
                <ProductDescription product={product} />
                <VariantSelector
                  product={product}
                  colors={settings.colors}
                  skuSignal={skuSignal}
                />
                {availability === "https://schema.org/InStock"
                  ? (
                    <AddToCartButton
                      closeQuickview={() => isOpen.value = false}
                      cardId={cardId}
                      product={isVariantOf ?? product}
                      seller={seller}
                      item={item}
                    />
                  )
                  : (
                    <>
                      <a
                        class="text-primary text-[12px] leading-[18px] underline font-bold mt-5 block text-center"
                        href={relative(url ?? "")}
                      >
                        ver detalhes do produto
                      </a>
                    </>
                  )}
              </div>
            </div>
          </div>
        )
        : null}
    </div>
  );
}

export default QuickViewMobile;
