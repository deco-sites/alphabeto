import { useScript } from "@deco/deco/hooks";
import { AnalyticsItem } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Icon from "../ui/Icon.tsx";
interface Props {
  item: AnalyticsItem;
}

const onLoad = (id: string, productID: string) =>
  window.STOREFRONT.WISHLIST.subscribe((sdk) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    const inWishlist = sdk.inWishlist(productID);
    button.disabled = false;
    button.classList.remove("htmx-request");
    const useTag = button.querySelector("use");
    const href = useTag?.getAttribute("href") ?? "";

    const newIconName = inWishlist ? "hearth-unfill" : "hearth-fill";
    const newHref = href.replace(/#.*$/, `#${newIconName}`);
    useTag?.setAttribute("href", newHref);
  });

const onClick = (productID: string, productGroupID: string) => {
  const button = event?.currentTarget as HTMLButtonElement;
  const user = window.STOREFRONT.USER.getUser();
  if (user?.email) {
    button.classList.add("htmx-request");
    window.STOREFRONT.WISHLIST.toggle(productID, productGroupID);
  } else {
    window.alert(`Faça login para adicionar o produto à lista de desejos`);
  }
};
function WishlistButton({ item }: Props) {
  // deno-lint-ignore no-explicit-any
  const productID = (item as any).item_id;
  const productGroupID = item.item_group_id ?? "";
  const id = useId();
  const addToWishlistEvent = useSendEvent({
    on: "click",
    event: {
      name: "add_to_wishlist",
      params: { items: [item] },
    },
  });
  return (
    <>
      <button
        id={id}
        data-wishlist-button
        disabled
        {...addToWishlistEvent}
        aria-label="Adicionar à lista de desejos"
        hx-on:click={useScript(onClick, productID, productGroupID)}
        class={clx(
          "btn no-animation",
          "btn-circle btn-ghost btn-sm",
          "h-10 w-10 ",
          "shadow-[0px_2px_10px_0px_rgba(59,_59,_59,_0.1)]",
          "text-[#FF859A]",
        )}
      >
        <Icon id="hearth-unfill" class="[.htmx-request_&]:hidden" size={20} />
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
      </button>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id, productID) }}
      />
    </>
  );
}
export default WishlistButton;
