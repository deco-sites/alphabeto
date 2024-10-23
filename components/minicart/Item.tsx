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
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 100;
/* This code is commented because the remove button is not present in the design
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)?.closest("fieldset")?.getAttribute("data-item-id");
  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);
  }
};
*/
function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name.replace(item.item_variant, "").trim();
  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      data-item-id={(item as any).item_id}
      class="grid grid-rows-1 gap-1"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={changeImageSizeUrl(image, 144, 204)}
        style={{ aspectRatio: "72 / 102" }}
        width={144}
        height={204}
        class="h-full object-contain max-w-[72px]"
      />

      {/* Info */}
      <div class="flex flex-col">
        {/* Name and Remove button */}
        <div class="flex justify-between items-center">
          <legend className="text-[#676767] text-xs font-bold leading-[18px] mb-1">
            {name}
          </legend>
          {
            /* This code is commented because the remove button is not present in the design
          <button class={clx(isGift && "hidden", "btn btn-ghost btn-square no-animation")} hx-on:click={useScript(removeItemHandler)}>
            <Icon id="trash" size={24} />
          </button> */
          }
        </div>
        {/* Color and Size */}
        <div className="text-[#676767] text-xs leading-[18px] flex gap-3 mb-[17px]">
          <span className="capitalize">Cor: {item.color.toLowerCase()}</span>
          <span>Tamanho: {item.size}</span>
        </div>
        {/* Price Block  And Quantity Selector*/}
        <div class="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-[5px]">
            {Boolean(listPrice) && (
              <>
                <span class="line-through text-xs leading-[14.4px] font-semibold text-[#c5c5c5]">
                  {formatPrice(listPrice, currency, locale)}
                </span>
                <span class="text-sm leading-[14.4px] font-semibold text-primary">
                  •
                </span>
              </>
            )}
            <span class="text-sm leading-[16.8px] font-bold text-primary">
              {isGift ? "Grátis" : formatPrice(price, currency, locale)}
            </span>
          </div>
          <div class={clx(isGift && "hidden")}>
            <QuantitySelector
              min={0}
              max={QUANTITY_MAX_VALUE}
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
