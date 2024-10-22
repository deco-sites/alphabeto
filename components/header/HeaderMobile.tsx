import Image from "apps/website/components/Image.tsx";
import Bag from "../../components/header/Bag.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import { Props } from "../../sections/Header/Header.tsx";

import { NAVBAR_HEIGHT_MOBILE, SEARCHBAR_DRAWER_ID, SIDEMENU_DRAWER_ID } from "../../constants.ts";
import { IconMenuDrawerOpen } from "../Icons/IconMenuDrawerOpen.tsx";
import { IconSearch } from "../Icons/IconSearch.tsx";
import Searchbar from "../search/Searchbar/Form.tsx";
import { MenuMobile } from "./MenuMobile.tsx";

export function Mobile({ logo, searchbar, loading, navItems, links }: Props) {
  return (
    <>
      <Drawer
        id={SEARCHBAR_DRAWER_ID}
        aside={
          <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID} class="max-w-[calc(100vw_-_20px)]">
            <div class="overflow-y-auto">
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
          <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID} class="max-w-[calc(100vw_-_20px)]">
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
        <label for={SIDEMENU_DRAWER_ID} class="btn btn-square btn-sm btn-ghost justify-start self-center" aria-label="open menu">
          <IconMenuDrawerOpen />
        </label>

        {logo && (
          <a href="/" class="flex-grow inline-flex items-center justify-center" style={{ minHeight: NAVBAR_HEIGHT_MOBILE }} aria-label="Store logo">
            <Image src={logo.src} alt={logo.alt} width={logo.width || 100} height={logo.height || 13} />
          </a>
        )}
        <div className="self-center flex justify-end items-center gap-5">
          <label for={SEARCHBAR_DRAWER_ID} class="btn btn-square btn-sm btn-ghost w-fit" aria-label="search icon button">
            <IconSearch />
          </label>
          <Bag />
        </div>
      </div>
    </>
  );
}