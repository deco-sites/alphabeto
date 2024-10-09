import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Searchbar, { SearchbarProps } from "../search/Searchbar/Form.tsx";
import Modal from "../ui/Modal.tsx";
import { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { SEARCHBAR_POPUP_ID } from "../../constants.ts";
import Icon from "../ui/Icon.tsx";
import Bag from "./Bag.tsx";
import NavItem from "./NavItem.tsx";
import { Items } from "./Menu.types.ts";

export interface Logo {
    src: ImageWidget;
    alt: string;
    width?: number;
    height?: number;
}

export interface SectionProps {
    alerts?: HTMLWidget[];
    /**
     * @title Navigation items
     * @description Navigation items used both on mobile and desktop menus
     */
    navItems?: Items[] | null;
    /**
     * @title Searchbar
     * @description Searchbar configuration
     */
    searchbar: SearchbarProps;
    /** @title Logo */
    logo: Logo;
    /**
     * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
     * @hide true */
    loading?: "eager" | "lazy";
}

export const Desktop = ({ navItems, logo, searchbar, loading }: SectionProps) => (
  <>
    <Modal>
      <div
        class="absolute top-0 bg-base-100 container"
      >
        {loading === "lazy" ? (
          <div class="flex justify-center items-center">
            <span class="loading loading-spinner" />
          </div>
        ) : (
          <Searchbar {...searchbar} />
        )}
      </div>
    </Modal>

    <div class="flex flex-col gap-4 pt-5 container border-b border-gray-300">
      <div class="grid grid-cols-3 place-items-center">
        <div class="place-self-start">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <label
          for={SEARCHBAR_POPUP_ID}
          class="input input-bordered flex items-center gap-2 w-full"
          aria-label="search icon button"
        >
          <Icon id="search" />
          <span class="text-base-400 truncate">Search products, brands...</span>
        </label>

        <div class="flex gap-4 place-self-end">
          <Bag />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <ul class="flex">
          {/* {navItems?.slice(0, 10).map((item) => (
            <NavItem item={item} />
          ))} */}
        </ul>
        <div>{/* ship to */}</div>
      </div>
    </div>
  </>
);
