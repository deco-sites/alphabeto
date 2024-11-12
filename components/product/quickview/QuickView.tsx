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
  const QUICKVIEW_ID = useId();

  return (
    <>
      <QuickViewModal id={QUICKVIEW_ID} className="!bg-transparent transform-none">
        <div class="bg-base-100 w-full">
          <p>{product.name}</p>
        </div>
      </QuickViewModal>
      <label
        for={QUICKVIEW_ID}
        class="w-[243px] desk-small:w-[150px] bg-primary-content h-10 cursor-pointer rounded-lg flex items-center px-2 justify-between gap-2"
      >
        QuickView
      </label>
    </>
  );
}
