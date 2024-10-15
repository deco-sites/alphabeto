import { IconArrowRightDropdown } from "../Icons/IconArrowRightDropdown.tsx";
import { Submenu } from "./Menu.types.ts";

interface Props {
  submenu: Submenu[] | null | undefined;
}

export function MenuMobileDetails({ submenu }: Props) {
  console.log(submenu);
  return (
    <div class="px-6">
      {submenu?.map((item, index) => (
        <details
          key={index}
          className="collapse rounded-none border-b-[1px] border-primary border-dashed"
        >
          <summary className="text-xs text-accent py-4 font-bold !flex justify-between items-center">
            {item.item[0]?.item || "Item"}
            <IconArrowRightDropdown />
          </summary>
          <div>
            {item.item.map((subItem) => {
              if (subItem.highlight) return null;
              return (
                <a
                  key={subItem.href}
                  href={subItem.href}
                  className={`block text-accent font-medium text-[13px] mb-5`}
                >
                  {subItem.item}
                </a>
              );
            })}

            {item.seeAll &&
              (
                <a
                  key={item.item[0]?.item}
                  href={item.item[0]?.href}
                  className={`block font-bold underline text-primary text-[13px] mb-4`}
                >
                  Ver mais
                </a>
              )}
          </div>
        </details>
      ))}
    </div>
  );
}
