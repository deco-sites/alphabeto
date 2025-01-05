import { useScript } from "@deco/deco/hooks";
import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { Platform } from "site/apps/site.ts";
import Button from "site/components/ui/Button.tsx";
import QuantitySelector from "site/components/ui/QuantitySelector.tsx";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import { relative } from "site/sdk/url.ts";
import { useId } from "site/sdk/useId.ts";
import { usePlatform } from "site/sdk/usePlatform.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  cardId: string;
}
// Add To Cart Button Click
const onClick = (
  cardId: string,
  qtdInputId: string,
  platform: Platform,
  minicartDrawerId: string,
) => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(button.getAttribute("data-cart-item")!),
  );
  document.getElementById(cardId)?.dispatchEvent(new Event("closeQuickview"));

  const qtdInput = document.getElementById(qtdInputId) as HTMLInputElement;
  let qtd = qtdInput?.value;

  const currentCart = window.STOREFRONT.CART.getCart();
  const itemInCart = currentCart?.items.find(
    (cartItem) => cartItem.item_id === item.item_id,
  );

  if (itemInCart) {
    qtd = String(Number(qtd) + itemInCart.quantity);
  }

  if (platform === "vtex") {
    platformProps.orderItems[0].quantity = qtd;
  } else if (
    platform === "vnda" || platform === "wake" || platform === "nuvemshop"
  ) {
    platformProps.quantity = qtd;
  } else if (platform === "linx") {
    platformProps.Quantity = qtd;
  }

  item.quantity = qtd;

  if (itemInCart) {
    const id = button.getAttribute("data-item-id");
    if (!id) return;
    window.STOREFRONT.CART.setQuantity(id, Number(qtd));
  } else {
    window.STOREFRONT.CART.addToCart(item, platformProps);
  }
  document.querySelector<HTMLInputElement>(`input#${minicartDrawerId}`)
    ?.click();
};

const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    };
  }
  return null;
};

function AddToCartButton(props: Props) {
  const { product, item, class: _class } = props;
  const platform = usePlatform();
  const platformProps = useAddToCart(props);
  const id = useId();
  const inputQtdId = useId();
  const relativeUrl = relative(product.url ?? "") ?? "";
  return (
    <div class="grid grid-cols-[142px,1fr] tablet-large::grid-cols-[133px,1fr] gap-[18px]">
      <QuantitySelector
        min="1"
        value="1"
        max="100"
        small={false}
        class="!text-base-content"
        containerClass="hidden tablet-large:flex"
        id={inputQtdId}
      />

      <a
        class="text-primary text-[12px] leading-[18px] underline font-bold flex items-center tablet-large:hidden"
        href={relativeUrl}
      >
        ver detalhes do produto
      </a>
      <Button
        data-item-id={product.productID}
        data-cart-item={encodeURIComponent(
          JSON.stringify({ item, platformProps }),
        )}
        id={id}
        class="h-11 min-h-11"
        hx-on:click={useScript(
          onClick,
          props.cardId,
          inputQtdId,
          platform,
          MINICART_DRAWER_ID,
        )}
      >
        Adicionar a Sacola
      </Button>
    </div>
  );
}
export default AddToCartButton;
