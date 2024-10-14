import Image from "apps/website/components/Image.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import { Props } from "../../sections/Header/Header.tsx";
import Bag from "../../components/header/Bag.tsx";

import {
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import Searchbar from "../search/Searchbar/Form.tsx";
import { IconCloseDrawer } from "../Icons/IconCloseDrawer.tsx";
import { MenuMobile } from "./MenuMobile.tsx";

export function Mobile({ logo, searchbar, loading, navItems }: Props) {
  return (
    <>
      <Drawer
        id={SEARCHBAR_DRAWER_ID}
        aside={
          <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
            <div class="w-screen overflow-y-auto">
              {loading === "lazy" ? (
                <div class="h-full w-full flex items-center justify-center">
                  <span class="loading loading-spinner" />
                </div>
              ) : (
                <Searchbar {...searchbar} />
              )}
            </div>
          </Drawer.Aside>
        }
      />
      <Drawer
        id={SIDEMENU_DRAWER_ID}
        class="w-full"
        aside={
          <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
            <MenuMobile navItems={navItems} />
          </Drawer.Aside>
        }
      />

      <div
        class="grid place-items-center w-screen px-5 gap-4"
        style={{
          height: NAVBAR_HEIGHT_MOBILE,
          gridTemplateColumns:
            "min-content auto min-content min-content min-content",
        }}
      >
        <label
          for={SIDEMENU_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost"
          aria-label="open menu"
        >
          <IconCloseDrawer  />
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

        <label
          for={SEARCHBAR_DRAWER_ID}
          class="btn btn-square btn-sm btn-ghost"
          aria-label="search icon button"
        >
          <IconCloseDrawer />
        </label>
        <Bag />
      </div>
    </>
  );    
}