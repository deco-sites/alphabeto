import { useDevice, useScript } from "@deco/deco/hooks";
import { AnalyticsItem } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  mode: "pdp" | "productCard";
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

    const newIconName = inWishlist ? "hearth-fill" : "hearth-unfill";
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
function WishlistButton({ item, mode }: Props) {
  // deno-lint-ignore no-explicit-any
  const productID = (item as any).item_id;
  const productGroupID = item.item_group_id ?? "";
  const id = useId();
  const device = useDevice();
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
          "h-10 w-10 min-h-10",
          "shadow-[0px_2px_10px_0px_rgba(59,_59,_59,_0.1)]",
          "text-[#FF859A] bg-white hover:bg-white hover:opacity-75",
          mode === "productCard"
            ? "mobile:w-[30px] mobile:h-[30px] mobile:min-h-[30px]"
            : "",
        )}
      >
        <Icon
          id="hearth-unfill"
          class="[.htmx-request_&]:hidden"
          size={device === "mobile" && mode === "productCard" ? 15 : 20}
        />
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
