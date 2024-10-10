import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";
import { Items } from "./Menu.types.ts";

function NavItem({href, menuItem, image, submenu}: Items) {
  return (
    <li
      class="group flex items-center pr-5 text-base-200"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={href}
        class="group-hover:border-b-4 border-[#70D1E8] text-base-200 text-sm font-medium flex items-center"
        style={{ height: NAVBAR_HEIGHT_DESKTOP }}
      >
        {menuItem}
      </a>

      {submenu && submenu.length > 0 &&
        (
          <div
            class="fixed hidden hover:flex group-hover:flex bg-base-100 z-40 items-start justify-center gap-6 w-screen"
            style={{
              top: "0px",
              left: "0px",
              marginTop: '128px',
            }}
          >
            {image && (
              <Image
                class="p-6"
                src={image}
                alt={menuItem}
                width={300}
                height={332}
                loading="lazy"
              />
            )}
            <ul class="flex items-start justify-start gap-6 container">
              {submenu.map((node) => (
                <li class="p-6 pl-0">
                  {/* <a class="hover:underline" href={node.url}>
                    <span>{node.name}</span>
                  </a> */}

                  <ul class="flex flex-col gap-1 mt-4">
                    {node.item?.map((leaf) => (
                      <li>
                        <a class="hover:underline text-base-200" href={leaf.href}>
                          <span class="text-xs">{leaf.item}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
    </li>
  );
}

export default NavItem;
