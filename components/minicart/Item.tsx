import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { changeImageSizeUrl } from "../../sdk/vtexProductImageUrlTambor.ts";
import QuantitySelector from "../ui/QuantitySelector.tsx";
export type Item = AnalyticsItem & {
  size: string;
  color: string;
  listPrice: number;
  image: string;
  item_id: string;
  item_name: string;
  item_variant: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 100;

function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  const name = item.item_name.replace(item.item_variant, "").trim();
  const hasListPrice = Boolean(listPrice) && listPrice > price;

  return (
    <fieldset
      data-item-id={item.item_id}
      class="grid grid-rows-1 gap-1"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={changeImageSizeUrl(image, 144, 204)}
        style={{ aspectRatio: "72 / 102" }}
        width={144}
        height={204}
        class="h-full object-contain max-w-[72px] max-h-[102px]"
      />

      {/* Info */}
      <div class="flex flex-col">
        {/* Name and Remove button */}
        <div class="flex justify-between items-center">
          <legend class="text-accent text-xs font-bold leading-[18px] mb-1">
            {name}
          </legend>
        </div>
        {/* Color and Size */}
        <div class="text-accent text-xs leading-[18px] flex gap-3 mb-[17px]">
          {item.color
            ? <span class="capitalize">Cor: {item.color?.toLowerCase()}</span>
            : null}
          {item.size ? <span>Tamanho: {item.size}</span> : null}
        </div>
        {/* Price Block  And Quantity Selector*/}
        <div class="flex items-center gap-2 justify-between">
          <div class="flex items-center gap-[5px]">
            {hasListPrice
              ? (
                <>
                  <span class="line-through text-xs leading-[14.4px] font-semibold text-[#c5c5c5]">
                    {formatPrice(listPrice, currency, locale)}
                  </span>
                  <span class="text-sm leading-[14.4px] font-semibold text-primary">
                    •
                  </span>
                </>
              )
              : null}
            <span class="text-sm leading-[16.8px] font-bold text-primary">
              {isGift ? "Grátis" : formatPrice(price, currency, locale)}
            </span>
          </div>
          <div class={clx(isGift && "hidden")}>
            <QuantitySelector
              min="0"
              max={String(QUANTITY_MAX_VALUE)}
              class="input-qtd"
              value={quantity}
              name={`item::${index}`}
              small
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
export default CartItem;
