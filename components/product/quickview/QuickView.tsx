import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import QuickViewModal from "site/components/product/quickview/QuickViewModal.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

export function QuickViewButton(props: Props) {
  const { product } = props;

  return (
    <QuickViewModal images={product.image}>
      <div>
        <p>{product.name}</p>
        <div>
          {product.offers?.highPrice}
          -
          {product.offers?.lowPrice}
        </div>
        {product.description}
        {product?.additionalProperty
          ?.filter(
            (property) =>
              property.name === "Cor" || property.name === "Tamanho",
          )
          .map((property, index) => (
            <div key={index}>
              <p>{property.name}: {property.value}</p>
            </div>
          ))}
      </div>
    </QuickViewModal>
  );
}
