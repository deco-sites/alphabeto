import { LinksProps } from "../../sections/Header/Header.tsx";
import { IconArrowRightDrawer } from "../Icons/IconArrowRightDrawer.tsx";
import Drawer from "../ui/Drawer.tsx";
import { Items } from "./Menu.types.ts";
import { MenuMobileDetails } from "./MenuMobileDetails.tsx";
import { SignInMobile } from "./SignIn.tsx";

interface Props {
  navItems: Items[] | null | undefined;
  otherLinks: LinksProps[] | null | undefined;
}

export function MenuMobile({ navItems, otherLinks }: Props) {
  const RenderOtherLinks = () => {
    if (otherLinks) {
      return (
        <nav className="mt-[30px] flex flex-col gap-5">
          {otherLinks.map((item) => (
            <a href={item.href} class="block font-[#676767] text-xs leading-[18px]">
              {item.title}
            </a>
          ))}
        </nav>
      );
    }
    return null;
  };

  return (
    <div class="px-6 bg-base-100">
      <SignInMobile />
      {navItems?.map((item) => (
        <div class="py-4 border-b border-secondary border-dashed">
          {item.submenu?.length ? (
            <>
              <Drawer
                id={item.menuItem}
                aside={
                  <Drawer.Aside title={item.menuItem} drawer={item.menuItem} class="max-w-[calc(100vw_-_20px)]">
                    <div class="overflow-y-auto bg-base-100">
                      <MenuMobileDetails submenu={item.submenu} />
                    </div>
                  </Drawer.Aside>
                }
              />
              <p class="flex justify-between items-center h-full">
                <label for={item.menuItem} class="h-full w-full text-primary font-bold text-xs" aria-label="open menu">
                  {item.menuItem}
                </label>

                <IconArrowRightDrawer />
              </p>
            </>
          ) : (
            <a href={item.href} class="block text-primary font-bold text-xs">
              {item.menuItem}
            </a>
          )}
        </div>
      ))}
      <RenderOtherLinks />
    </div>
  );
}
