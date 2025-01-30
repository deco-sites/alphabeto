import Image from "apps/website/components/Image.tsx";
import { useMemo } from "preact/hooks";
import {
  PlataformProps,
  ProductResumeProps,
} from "site/components/product/ProductBuyTogether/types.ts";
import Button from "site/components/ui/Button.tsx";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import { formatPrice } from "site/sdk/format.ts";
import { useOffer } from "site/sdk/useOffer.ts";

export default function ProductResume(props: ProductResumeProps) {
  const principalProduct =
    props.principalProduct.value.product.isVariantOf?.hasVariant.find(
      (variant) => variant.sku === props.principalProduct.value.selectedVariant,
    ) ?? props.principalProduct.value.product;
  const sugestionOne =
    props.sugestionOne.value.product.isVariantOf?.hasVariant.find(
      (variant) => variant.sku === props.sugestionOne.value.selectedVariant,
    ) ?? props.sugestionOne.value.product;
  const sugestionTwo =
    props.sugestionTwo.value.product.isVariantOf?.hasVariant.find(
      (variant) => variant.sku === props.sugestionTwo.value.selectedVariant,
    ) ?? props.sugestionTwo.value.product;

  const principalProductImage = principalProduct.image?.at(0)?.url;
  const sugestionOneImage = sugestionOne.image?.at(0)?.url;
  const sugestionTwoImage = sugestionTwo.image?.at(0)?.url;
  const { price: principalProductPrice, seller: principalProductSeller } =
    useOffer(principalProduct.offers);
  const { price: sugestionOnePrice, seller: sugestionOneSeller } = useOffer(
    sugestionOne.offers,
  );
  const { price: sugestionTwoPrice, seller: sugestionTwoSeller } = useOffer(
    sugestionTwo.offers,
  );
  const isSugestionOneEnabled = props.sugestionOne.value.enabled;
  const isSugestionTwoEnabled = props.sugestionTwo.value.enabled;
  const totalPrice = useMemo(() => {
    let total = principalProductPrice ?? 0;
    if (isSugestionOneEnabled) {
      total += sugestionOnePrice ?? 0;
    }
    if (isSugestionTwoEnabled) {
      total += sugestionTwoPrice ?? 0;
    }
    return total;
  }, [
    principalProductPrice,
    sugestionOnePrice,
    sugestionTwoPrice,
    isSugestionOneEnabled,
    isSugestionTwoEnabled,
  ]);
  const message = useMemo(() => {
    if (isSugestionOneEnabled && isSugestionTwoEnabled) {
      return "Compre junto mais 2 produtos por:";
    }
    if (isSugestionOneEnabled || isSugestionTwoEnabled) {
      return "Compre junto mais 1 produto por:";
    }
    return "Leve somente o produto principal por:";
  }, [isSugestionOneEnabled, isSugestionTwoEnabled]);

  const addToCart = () => {
    alert("Adicionando ao carrinho");
    const plataformProps: PlataformProps = {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{
        quantity: 1,
        seller: principalProductSeller ?? "1",
        id: principalProduct.sku ?? "1",
      }],
    };
    if (isSugestionOneEnabled) {
      plataformProps.orderItems.push({
        quantity: 1,
        seller: sugestionOneSeller ?? "1",
        id: sugestionOne.sku ?? "1",
      });
    }
    if (isSugestionTwoEnabled) {
      plataformProps.orderItems.push({
        quantity: 1,
        seller: sugestionTwoSeller ?? "1",
        id: sugestionTwo.sku ?? "1",
      });
    }
    console.log("PlataformProps", plataformProps);
    alert("Adicionando ao carrinho 2");
    window.STOREFRONT.CART.addToCart({
      item_id: principalProduct.sku ?? "1",
      listPrice: principalProductPrice ?? 0,
      image: principalProductImage ?? "",
      color: "",
      size: "",
      item_name: principalProduct.name ?? "",
      quantity: 1,
      item_variant: principalProduct.sku ?? "",
    }, plataformProps);
    alert("Adicionando ao carrinho 3");
    document
      .querySelector<HTMLInputElement>(`input#${MINICART_DRAWER_ID}`)
      ?.click();
  };

  return (
    <div
      class="flex flex-col mobile:items-center gap-2.5 max-w-[335px] mobile:mx-auto rounded-lg desk:max-w-[209px] desk:w-[209px] mobile:bg-white mobile:px-3 py-5"
      id="product-resume"
    >
      <div class="grid grid-cols-3 desk:hidden gap-1.5 items-end justify-center w-fit pb-0.5">
        <div class="flex flex-col gap-0.5 w-fit">
          <p class="text-primary max-w-[101px] text-xs leading-[18px] font-bold text-center">
            Você está vendo este produto
          </p>
          <div class="border-2 border-[#D6DE23] rounded w-fit">
            <Image
              class="rounded max-w-[90px] min-w-[90px] max-h-[134px] w-full h-full aspect-[90/134]"
              width={90}
              height={134}
              src={principalProductImage ?? ""}
            />
          </div>
        </div>
        {isSugestionOneEnabled && (
          <div class="border-2 border-transparent w-fit">
            <Image
              class="rounded max-w-[90px] min-w-[90px] max-h-[134px] w-full h-full mx-1 aspect-[90/134]"
              width={90}
              height={134}
              src={sugestionOneImage ?? ""}
            />
          </div>
        )}
        {isSugestionTwoEnabled && (
          <div class="border-2 border-transparent w-fit">
            <Image
              class="rounded max-w-[90px] min-w-[90px] max-h-[134px] w-full h-full mx-1 aspect-[90/134]"
              width={90}
              height={134}
              src={sugestionTwoImage ?? ""}
            />
          </div>
        )}
      </div>
      <p class="text-base-300 text-sm font-bold text-center desk:max-w-[136px] mx-auto">
        {message}
      </p>
      <p
        id="price"
        class="text-primary text-xl font-bold leading-6 text-center"
      >
        {formatPrice(totalPrice)}
      </p>
      <Button
        type="button"
        onClick={addToCart}
        class="h-11 w-[237px] desk:w-full"
      >
        Compre junto
      </Button>
    </div>
  );
}
