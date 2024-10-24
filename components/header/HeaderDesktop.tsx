import Image from "apps/website/components/Image.tsx";
import { Logo } from "../../sections/Header/Header.tsx";
import { SearchBarComponentProps } from "../search/Searchbar/Form.tsx";
import Bag from "./Bag.tsx";
import GeolocationOffers from "./GeolocationOffers/index.tsx";
import { Items } from "./Menu.types.ts";
import NavItem from "./NavItem.tsx";
import { SearchDesktop } from "./Search.tsx";
import { SignInDesktop } from "./SignIn.tsx";
import { Wishlist } from "./Wishlist.tsx";

export interface SectionProps {
  navItems?: Items[];
  searchbar: SearchBarComponentProps;
  logo: Logo;
  loading?: "eager" | "lazy";
  googleMapsApiKey: string;
}

export const Desktop = ({ navItems, logo, searchbar, loading, googleMapsApiKey }: SectionProps) => (
  <>
    <div class="flex flex-col gap-4 pt-5 container border-b border-gray-300">
      <div class="flex justify-between gap-x-2.5 items-center">
        <ul class="flex gap-x-6 desk-small:gap-x-3">
          {navItems?.map((item) => (
            <NavItem href={item.href} menuItem={item.menuItem} image={item.image} submenu={item.submenu} />
          ))}
        </ul>

        <div>
          <a href="/" aria-label="Logo Alphabeto">
            <Image src={logo.src} alt={logo.alt} width={logo.width || 100} height={logo.height || 23} />
          </a>
        </div>

        <div class="flex items-center gap-x-5 desk-small:gap-x-3">
          <GeolocationOffers googleMapsApiKey={googleMapsApiKey} />
          <SearchDesktop searchbar={searchbar} loading={loading} />

          <div class="flex gap-4">
            <Wishlist />
            <SignInDesktop />
            <Bag />
          </div>
        </div>
      </div>
    </div>
  </>
);
