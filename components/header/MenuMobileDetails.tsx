import { IconArrowRightDropdown } from "../Icons/IconArrowRightDropdown.tsx";
import { SendEventOnClick } from "site/components/Analytics.tsx";
import { useId } from "site/sdk/useId.ts";
import { Submenu } from "./Menu.types.ts";

interface Props {
  submenu: Submenu[] | null | undefined;
}

export function MenuMobileDetails({ submenu }: Props) {
  return (
    <div class="px-6">
      {submenu?.map((item, index) => {
        const seeAllID = useId();

        return (
          <details
            key={index}
            class="collapse rounded-none border-b border-secondary border-dashed group"
          >
            <summary class="text-xs text-accent py-4 font-bold !flex justify-between items-center">
              {item.item[0]?.item || "Item"}
              <IconArrowRightDropdown/>
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
                        name: 'menu_click',
                        params: {
                          name: subItem.item,
                          url: subItem.href
                        }
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
                      name: 'menu_click',
                      params: {
                        name: 'Ver mais (mobile)',
                        url: item.item[0]?.href
                      }
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
