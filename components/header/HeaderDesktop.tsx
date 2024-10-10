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
import { headerMenuContent } from "./content.ts";
import { Wishlist } from "./Wishlist.tsx"; 
import SignIn from "./SignIn.tsx";
import { Search } from "./Search.tsx";

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

export const Desktop = ({
  navItems,
  logo,
  searchbar,
  loading
}: SectionProps) => (
  <>
    <div class="flex flex-col gap-4 pt-5 container border-b border-gray-300">
      <div class="flex justify-between items-center">
        <div class="flex justify-between items-center">
          <ul class="flex">
            {navItems?.map((item) => (
              <NavItem
                href={item.href}
                menuItem={item.menuItem}
                image={item.image}
                submenu={item.submenu}
              />
            ))}
          </ul>
          <div>{/* ship to */}</div>
        </div>

        <div>
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <Search searchbar={searchbar} loading={loading} />

        <div class="flex gap-4">
          <Wishlist />
          <SignIn variant="desktop" />
          <Bag />
        </div>
      </div>
    </div>
  </>
);
