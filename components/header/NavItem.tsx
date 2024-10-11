import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import { Items } from "./Menu.types.ts";

function NavItem({ href, menuItem, image, submenu }: Items) {
  return (
    <li
      class="group flex items-center text-base-200"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={href}
        class="group-hover:border-b-4 border-[#70D1E8] text-base-200 text-sm font-medium flex items-center"
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
          <div className="container flex justify-between gap-9 !pr-0">
            <div className="w-full">
              <h5 className="text-[#676767] font-['BeccaPerry'] pb-[13px] leading-[38px] text-[32px] border-b border-base-200 border-dashed">
                {menuItem}
              </h5>
              <ul class="flex items-start justify-start gap-6">
                {submenu.map((node) => {
                  return (
                    <>
                      <li class="p-6 pl-0">
                        <ul class="mt-4">
                          {node.item?.map((leaf) => (
                            <li>
                              <a
                                class={`hover:underline ${
                                  leaf.highlight
                                    ? "text-base-200"
                                    : "text-base-content"
                                }`}
                                href={leaf.href}
                              >
                                <span class="text-xs">{leaf.item}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>

                      {
                        /* {
                        node.seeAll && <a href={href}></a>
                      } */
                      }
                    </>
                  );
                })}
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
