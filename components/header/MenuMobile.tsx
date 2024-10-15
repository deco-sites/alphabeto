import { IconArrowRightDrawer } from "../Icons/IconArrowRightDrawer.tsx";
import Drawer from "../ui/Drawer.tsx";
import { Items } from "./Menu.types.ts";
import { MenuMobileDetails } from "./MenuMobileDetails.tsx";

interface Props {
  navItems: Items[] | null | undefined;
}

export function MenuMobile({ navItems }: Props) {
  console.log({ navItems });
  return (
    <div class="px-6">
      {navItems?.map((item) => (
        <>
          <div class="py-4 border-b-[1px] border-primary border-dashed">
            {item.submenu?.length
              ? (
                <>
                  <Drawer
                    id={item.menuItem}
                    aside={
                      <Drawer.Aside
                        title={item.menuItem}
                        drawer={item.menuItem}
                      >
                        <div class="overflow-y-auto">
                          <MenuMobileDetails submenu={item.submenu} />
                        </div>
                      </Drawer.Aside>
                    }
                  />
                  <p class="flex justify-between items-center h-full">
                    <label
                      for={item.menuItem}
                      class="h-full w-full text-primary font-bold text-xs"
                      aria-label="open menu"
                    >
                      {item.menuItem}
                    </label>

                    <IconArrowRightDrawer />
                  </p>
                </>
              )
              : (
                <a
                  href={item.href}
                  class="block text-primary font-bold text-xs"
                >
                  {item.menuItem}
                </a>
              )}
          </div>
        </>
      ))}
    </div>
  );
}
