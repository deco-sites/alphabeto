import { useScript } from "@deco/deco/hooks";
import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { Platform } from "site/apps/site.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}
// Add To Cart Button Click
const onClick = (
  qtdInputId: string,
  platform: Platform,
  minicartDrawerId: string,
) => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(button.getAttribute("data-cart-item")!),
  );
  console.log({ item, platformProps });

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
  return (
    <div
      id={id}
      class="flex"
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps }),
      )}
    >
      <input type="checkbox" class="hidden peer" />

      <button
        disabled
        class={clx(
          "flex-grow peer-checked:hidden text-sm font-bold text-white text-center bg-[#FF8300] py-[13px] px-5",
          _class?.toString(),
        )}
        hx-on:click={useScript(onClick)}
      >
        Adicionar à sacola
      </button>

      {/* Quantity Input */}
      <div class="flex-grow hidden peer-checked:flex">
        <QuantitySelector
          disabled
          min={0}
          max={100}
          hx-on:change={useScript(onChange)}
        />
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default AddToCartButton;
