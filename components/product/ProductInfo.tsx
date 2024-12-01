import { useScriptAsDataURI } from "@deco/deco/hooks";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductAgeRangeIndicator from "site/components/product/ProductAgeRangeIndicator.tsx";
import ProductCashback from "site/components/product/ProductCashback.tsx";
import ProductSizebay from "site/components/product/ProductSizebay.tsx";
import ProductSmallDescription from "site/components/product/ProductSmallDescription.tsx";
import { SizeBaySettings } from "site/loaders/sizebay.ts";
import { PDPSettings } from "site/sections/Product/ProductDetails.tsx";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";

interface Props {
  page: ProductDetailsPage | null;
  settings: PDPSettings;
  sizebaySettings: SizeBaySettings;
}

function ProductInfo({ page, settings, sizebaySettings }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const {
    price = 0,
    listPrice,
    seller = "1",
    availability,
    installments,
  } = useOffer(offers);

  const referenceCode = isVariantOf?.model;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  const hasListPrice = listPrice && listPrice > price;

  return (
    <div
      {...viewItemEvent}
      class="flex flex-col desk:max-w-[min(33.33vw,480px)]"
      id={id}
    >
      <ProductAgeRangeIndicator product={product} />
      <WishlistButton item={item} />
      {/* Product Name */}
      <span
        class={"text-[#676767] text-[22px] mobile:leading-[26px] desk:text-3xl font-bold"}
      >
        {title}
      </span>

      <div class="flex gap-[15px] mt-3">
        {/** Reference Code */}
        <span class="text-xs leading-[18px] desk:leading-[14px] text-[#676767]">
          REF: {referenceCode}
        </span>
      </div>

      <div class="mt-5 desk:mt-[30px] flex gap-6 items-center mb-10 desk:mb-[30px]">
        <div>
          {/* Prices */}
          <div class="flex items-center">
            {hasListPrice && (
              <>
                <span class="line-through text-[#C5C5C5] text-xs leading-[14px] desk:text-sm desk:leading-4 font-semibold">
                  {formatPrice(listPrice, offers?.priceCurrency)}
                </span>
                <span class="desk:text-sm desk:leading-4 font-semibold text-primary mx-[5px]">
                  •
                </span>
              </>
            )}
            <span class="text-xl leading-6 font-bold text-primary">
              {formatPrice(price, offers?.priceCurrency)}
            </span>
          </div>
          {/* Installments */}
          {installments && (
            <span class="text-xs leading-[18px] desk:leading-[14px] text-[#676767] font-bold mt-[5px] block">
              Em até {installments}
            </span>
          )}
        </div>
        <ProductCashback
          product={product}
          percentage={settings.cashbackPercentage}
        />
      </div>

      <ProductSmallDescription product={product} />

      {/* Sku Selector */}
      {hasValidVariants && (
        <div class="mt-[30px] mb-5">
          <ProductSelector product={product} />
        </div>
      )}

      <ProductSizebay sizebay={sizebaySettings} />

      {availability === "https://schema.org/InStock"
        ? (
          <AddToCartButton
            item={item}
            seller={seller}
            product={product}
            class="btn btn-primary no-animation"
            disabled={false}
          />
        )
        : <OutOfStock productID={productID} />}

      {/* Shipping Simulation */}
      <div class="mt-8">
        <ShippingSimulationForm
          items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        />
      </div>

      {/* Description card */}
      <div class="mt-4 sm:mt-6">
        <span class="text-sm">
          {description && (
            <details>
              <summary class="cursor-pointer">Description</summary>
              <div
                class="ml-2 mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </details>
          )}
        </span>
      </div>
      <script
        src={useScriptAsDataURI((data: unknown) => {
          console.log(data);
        }, sizebaySettings)}
      />
    </div>
  );
}

export default ProductInfo;
