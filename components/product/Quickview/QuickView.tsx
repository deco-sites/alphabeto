import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import { JSX } from "preact";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import AddToCartButton from "site/components/product/AddToCartButton.tsx";
import { clx } from "site/sdk/clx.ts";
import Button from "site/components/ui/Button.tsx";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";
import ProductAgeRangeIndicator from "site/components/product/ProductAgeRangeIndicator.tsx";
import QuikviewHeader from "site/components/product/Quickview/Header.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import { formatPrice } from "site/sdk/format.ts";
import ProductCashback from "site/components/product/Quickview/ProductCashback.tsx";
export interface ColorItem {
  name: string;
  hexadecimals: string[];
}

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  settings: {
    cashbackPercentage: number;
  };
}

const script = (id: string, showButtonId: string, imagesModalId: string) => {
  const togglebutton = document.getElementById(showButtonId);
  const closeDrawerbutton = document.getElementById("closeModalId");
  const drawer = document.getElementById(id);
  const delayedSection = document.getElementById(imagesModalId);

  const toggleDrawer = () => {
    if (drawer?.classList.contains("translate-x-full")) {
      drawer?.classList.remove("translate-x-full");
      drawer?.classList.add("translate-x-0");

      setTimeout(() => {
        delayedSection?.classList.remove("translate-x-full");
        delayedSection?.classList.remove("right-0");
        delayedSection?.classList.add("translate-x-0");
        delayedSection?.classList.add("right-[375px]");
      }, 300);
    } else {
      drawer?.classList.remove("translate-x-0");
      drawer?.classList.add("translate-x-full");

      delayedSection?.classList.remove("translate-x-0");
      delayedSection?.classList.add("translate-x-full");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      drawer &&
      delayedSection &&
      togglebutton &&
      !drawer.contains(event.target as Node) &&
      !delayedSection.contains(event.target as Node) &&
      event.target !== togglebutton
    ) {
      drawer?.classList.remove("translate-x-0");
      drawer?.classList.add("translate-x-full");

      delayedSection?.classList.remove("translate-x-0");
      delayedSection?.classList.add("translate-x-full");
      delayedSection?.classList.remove("right-[375px]");
      delayedSection?.classList.add("right-0");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  togglebutton?.addEventListener("click", toggleDrawer);

  closeDrawerbutton?.addEventListener("click", () => {
    drawer?.classList.remove("translate-x-0");
    drawer?.classList.add("translate-x-full");

    delayedSection?.classList.remove("translate-x-0");
    delayedSection?.classList.add("translate-x-full");
    delayedSection?.classList.remove("right-[375px]");
    delayedSection?.classList.add("right-0");
  });
};

function QuickViewDesktop({ product, seller, item, settings }: Props) {
  const modalId = useId();
  const showButtonId = useId();
  const imagesModalId = useId();
  const { offers, isVariantOf } = product;
  const productName = isVariantOf?.name ?? product.name;
  const { listPrice, price, installments } = useOffer(offers);
  const referenceCode = isVariantOf?.model;
  const hasListPrice = listPrice && listPrice > (price ?? 0);

  return (
    <>
      <div className="text-center flex justify-center">
        <Button
          id={showButtonId}
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
      {/* Product Info */}
      <div
        id={modalId}
        class="fixed top-0 right-0 z-50 h-screen overflow-y-auto transition-transform translate-x-full bg-white w-[375px]"
      >
        <QuikviewHeader modalId={modalId} />
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
          <p
            className={"text-xs font-medium leading-[18px] text-[#7E7F88] line-clamp-3"}
          >
            {product.description}
          </p>
          <a
            href={product?.url}
            className="text-[#FF8300] font-bold underline relative text-xs -top-5 left-64 bg-white p-1"
          >
            Veja mais
          </a>

          <div>
            {product?.additionalProperty
              ?.filter((property) => property.name === "Cor")
              .map((property, index) => (
                <p
                  className={"text-[#7E7F88] text-xs font-bold leading-[14px] "}
                  key={index}
                >
                  Selecione a cor:{" "}
                  <strong className={"font-normal"}>{property.value}</strong>
                </p>
              ))}
          </div>

          <div>
            {product?.additionalProperty
              ?.filter((property) => property.name === "Tamanho")
              .map((property, index) => (
                <p
                  className={"text-[#7E7F88] text-xs font-bold leading-[14px] "}
                  key={index}
                >
                  Selecione o tamanho:{" "}
                  <strong className={"font-normal"}>{property.value}</strong>
                </p>
              ))}
          </div>

          <AddToCartButton product={product} seller={seller} item={item} />
        </div>
      </div>
      {/* Product Images */}
      <div
        id={imagesModalId}
        style={{ scrollbarWidth: "none" }}
        className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-[375px] flex flex-col gap-[10px]"
      >
        {product.image?.map((image, index) => (
          <div key={index} className="">
            <VTEXImageTag
              src={image.url ?? ""}
              width={327}
              height={507}
              alt={image.alternateName || "Image"}
              title={image.name || "Image"}
              className="rounded-md w-full aspect-[327/507] object-cover"
            />
          </div>
        ))}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(script, modalId, showButtonId, imagesModalId),
        }}
      />
    </>
  );
}

export default QuickViewDesktop;
