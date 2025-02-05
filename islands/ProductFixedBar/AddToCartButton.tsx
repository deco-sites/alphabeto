import { useSignal } from "@preact/signals";
import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { Item } from "site/components/minicart/Item.tsx";
import Button from "site/components/ui/Button.tsx";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import QuantitySelector from "site/islands/ProductFixedBar/QuantitySelector.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  qtd?: number;
}

const useAddToCart = ({ product, qtd }: Props) => {
  const { productID } = product;

  return {
    allowedOutdatedData: ["paymentData"],
    orderItems: [{ quantity: qtd ?? 1, seller: "1", id: productID }],
  };
};

function AddToCartButton(props: Props) {
  const { product, item, class: _class } = props;

  const qtd = useSignal(1);
  const platformProps = useAddToCart({
    ...props,
    qtd: qtd.value,
  });

  const onClick = () => {
    event?.stopPropagation();

    const id = product.sku;
    const currentCart = window.STOREFRONT.CART.getCart();
    const itemInCart = currentCart?.items.find(
      (cartItem) => cartItem.item_id === id,
    );

    if (itemInCart) {
      window.STOREFRONT.CART.setQuantity(id, itemInCart.quantity + qtd.value);
    } else {
      window.STOREFRONT.CART.addToCart(item as Item, platformProps);
    }
    document.querySelector<HTMLInputElement>(`input#${MINICART_DRAWER_ID}`)
      ?.click();
  };
  return (
    <div class="grid grid-cols-[142px,1fr] tablet-large::grid-cols-[133px,1fr] gap-[18px] desk:min-w-[397px] mobile:w-full">
      <QuantitySelector signal={qtd} />
      <Button
        onClick={onClick}
        class="h-11 min-h-11"
      >
        Adicionar a Sacola
      </Button>
    </div>
  );
}
export default AddToCartButton;
