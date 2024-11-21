import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { useId } from "site/sdk/useId.ts";
import QuickViewModal from "site/components/product/quickview/QuickViewModal.tsx";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

export function QuickViewButton(props: Props) {
  const { product } = props;
  console.log(props);

  return (
    <QuickViewModal>
      <div>
        <p>{product.name}</p>
      </div>
    </QuickViewModal>
  );
}
