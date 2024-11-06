import Image from "apps/website/components/Image.tsx";
import Bag from "../../components/header/Bag.tsx";
import { Props } from "../../sections/Header/Header.tsx";
import Drawer from "../ui/Drawer/index.tsx";
import { SearchMobile } from "./Search.tsx";

import { NAVBAR_HEIGHT_MOBILE, SIDEMENU_DRAWER_ID } from "../../constants.ts";
import { IconMenuDrawerOpen } from "../Icons/IconMenuDrawerOpen.tsx";
import { MenuMobile } from "./MenuMobile.tsx";

export function Mobile({ logo, searchbar, loading, navItems, links }: Props) {
  return (
    <>
      <Drawer
        id={SIDEMENU_DRAWER_ID}
        class="w-full"
        aside={
          <Drawer.Aside
            title="Menu"
            drawer={SIDEMENU_DRAWER_ID}
            class="max-w-[calc(100vw_-_20px)]"
          >
            <MenuMobile navItems={navItems} otherLinks={links} />
          </Drawer.Aside>
        }
      />

      <div
        class="grid grid-cols-[1fr_110px_1fr] w-screen px-5 gap-4"
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
        }}
      >
        <label
          for={SIDEMENU_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost justify-start self-center"
          aria-label="open menu"
        >
          <IconMenuDrawerOpen />
        </label>

        {logo && (
          <a
            href="/"
            class="flex-grow inline-flex items-center justify-center"
            style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
            aria-label="Store logo"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 13}
            />
          </a>
        )}
        <div class="self-center flex justify-end items-center gap-5">
          <SearchMobile searchbar={searchbar} loading={loading} />
          <Bag />
        </div>
      </div>
    </>
  );
}
