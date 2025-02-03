import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { Item } from "site/components/minicart/Item.tsx";
import Button from "site/components/ui/Button.tsx";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import { relative } from "site/sdk/url.ts";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  cardId: string;
  closeQuickview: () => void;
}
// Add To Cart Button Click

const useAddToCart = ({ product }: Props) => {
  const { productID } = product;

  return {
    allowedOutdatedData: ["paymentData"],
    orderItems: [{ quantity: 1, seller: "1", id: productID }],
  };
};

function AddToCartButton(props: Props) {
  const { product, item, class: _class, closeQuickview } = props;
  const platformProps = useAddToCart(props);
  const relativeUrl = relative(product.url ?? "") ?? "";

  const onClick = () => {
    event?.stopPropagation();

    const id = product.sku;
    const currentCart = window.STOREFRONT.CART.getCart();
    const itemInCart = currentCart?.items.find(
      (cartItem) => cartItem.item_id === id,
    );

    if (itemInCart) {
      window.STOREFRONT.CART.setQuantity(id, itemInCart.quantity + 1);
    } else {
      window.STOREFRONT.CART.addToCart(item as Item, platformProps);
    }
    document.querySelector<HTMLInputElement>(`input#${MINICART_DRAWER_ID}`)
      ?.click();
    closeQuickview();
  };
  return (
    <div class="grid grid-cols-[142px,1fr] tablet-large::grid-cols-[133px,1fr] gap-[18px]">
      <a
        class="text-primary text-[12px] leading-[18px] underline font-bold flex items-center tablet-large:hidden"
        href={relativeUrl}
      >
        ver detalhes do produto
      </a>
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
