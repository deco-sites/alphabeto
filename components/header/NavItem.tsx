import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import { Item, Items, Submenu } from "./Menu.types.ts";

function NavItem({ href, menuItem, image, submenu }: Items) {
  const getHighlight = (items: Item[]) => {
    return items.filter((item) => item.highlight)[0];
  };

  const RenderSubmenuNode = ({ item, seeAll }: Submenu) => {
    const highlight = getHighlight(item);
    const notHighlightItems = item.filter((item) => !item.highlight);
    return (
      <>
        <li class="pb-6">
          <ul class="mt-4 flex flex-col">
            {highlight && (
              <li class="block h-fit pr-[60px]">
                <a
                  class="text-base-200 mb-5 font-bold hover:text-[#D6DE23] block text-[13px]"
                  href={highlight.href}
                >
                  <span>{highlight.item}</span>
                </a>
              </li>
            )}
            <div class="flex flex-col flex-wrap max-h-[224px]">
              {notHighlightItems?.map((leaf) => (
                <li class="block h-fit pr-[60px]">
                  <a
                    class={`text-[13px] block text-accent mb-3 hover:text-base-200`}
                    href={leaf.href}
                  >
                    <span>{leaf.item}</span>
                  </a>
                </li>
              ))}
              {seeAll && (
                <li class="block h-fit">
                  <a
                    class="text-[13px] border-b-[1px] border-[#FF859A] text-[#FF859A] font-bold block w-fit"
                    href={href}
                  >
                    Ver mais
                  </a>
                </li>
              )}
            </div>
          </ul>
        </li>
      </>
    );
  };

  return (
    <li
      class="group flex items-center text-base-200"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={href}
        class="border-b-4 group-hover:border-b-[#70D1E8] border-t-4 border-transparent text-base-200 text-[13px] font-bold flex items-center"
        style={{ height: NAVBAR_HEIGHT_DESKTOP }}
      >
        {menuItem}
      </a>

      {submenu && submenu.length > 0 && (
        <div
          class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 w-screen"
          style={{
            top: "0px",
            left: "0px",
            marginTop: HEADER_HEIGHT_DESKTOP,
          }}
        >
          <div class="container flex justify-between gap-9 !pr-0">
            <div class="w-full pt-[23px]">
              <h5 class="text-[#676767] font-beccaPerry pb-[17px] leading-[38px] text-[32px] border-b border-[#F7E0BF] border-dashed">
                {menuItem}
              </h5>
              <ul class="flex items-start justify-start gap-[60px]">
                {submenu.map((node) => <RenderSubmenuNode {...node} />)}
              </ul>
            </div>
            {image && (
              <Image
                src={image}
                alt={menuItem}
                width={279}
                height={377}
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default NavItem;
