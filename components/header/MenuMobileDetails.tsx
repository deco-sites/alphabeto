import { useDevice } from "@deco/deco/hooks";
import { SendEventOnClick } from "site/components/Analytics.tsx";
import { useId } from "site/sdk/useId.ts";
import { IconArrowRightDropdown } from "../Icons/IconArrowRightDropdown.tsx";
import { Submenu } from "./Menu.types.ts";

interface Props {
  submenu: Submenu[] | null | undefined;
}

export function MenuMobileDetails({ submenu }: Props) {
  const device = useDevice();

  return (
    <div class="px-6">
      {submenu?.map((item, index) => {
        const seeAllID = useId();

        return (
          <details
            key={index}
            class="collapse rounded-none border-b border-secondary border-dashed group"
          >
            <summary class="text-xs text-accent py-4 font-bold ">
              <div class="flex justify-between items-center">
                <span>{item.item[0]?.item || "Item"}</span>
                <IconArrowRightDropdown />
              </div>
            </summary>

            <div>
              {item.item.map((subItem) => {
                if (subItem.highlight) return null;

                const itemID = useId();

                return (
                  <>
                    <a
                      key={subItem.item}
                      href={subItem.href}
                      class={`block text-accent font-medium text-[13px] mb-5`}
                      id={itemID}
                    >
                      {subItem.item}
                    </a>

                    <SendEventOnClick
                      id={itemID}
                      event={{
                        name: "submenu_click",
                        params: {
                          name: subItem.item,
                          url: subItem.href,
                          device,
                        },
                      }}
                    />
                  </>
                );
              })}

              {item.seeAll && (
                <>
                  <a
                    key={item.item[0]?.item}
                    href={item.item[0]?.href}
                    class={`block font-bold underline text-primary text-[13px] mb-4`}
                    id={seeAllID}
                  >
                    Ver mais
                  </a>

                  <SendEventOnClick
                    id={seeAllID}
                    event={{
                      name: "submenu_click",
                      params: {
                        name: "Ver mais",
                        url: item.item[0]?.href,
                        device,
                      },
                    }}
                  />
                </>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
