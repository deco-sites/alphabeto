import Image from "apps/website/components/Image.tsx";
import Bag from "site/components/header/Bag.tsx";
import GeolocationOffers from "site/components/header/GeolocationOffers/index.tsx";
import { Items } from "site/components/header/Menu.types.ts";
import NavItem from "site/components/header/NavItem.tsx";
import { SearchDesktop } from "site/components/header/Search.tsx";
import { SignInDesktop } from "site/components/header/SignIn.tsx";
import { Wishlist } from "site/components/header/Wishlist.tsx";
import { SearchBarComponentProps } from "site/components/search/Searchbar/Form.tsx";
import { Logo } from "site/sections/Header/Header.tsx";

export interface SectionProps {
  navItems?: Items[];
  searchbar: SearchBarComponentProps;
  logo: Logo;
  loading?: "eager" | "lazy";
  googleMapsApiKey: string;
  cep?: string;
}

export const Desktop = (
  { navItems, logo, searchbar, loading, googleMapsApiKey, cep }: SectionProps,
) => (
  <>
    <div class="flex flex-col gap-4 container border-b border-gray-300">
      <div class="flex justify-between gap-x-2.5 items-center">
        <ul class="flex gap-x-6 desk-small:gap-x-3">
          {navItems?.map((item) => (
            <NavItem
              href={item.href}
              menuItem={item.menuItem}
              image={item.image}
              submenu={item.submenu}
            />
          ))}
        </ul>

        <div>
          <a href="/" aria-label="Logo Alphabeto">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <div class="flex items-center gap-x-5 desk-small:gap-x-3">
          <GeolocationOffers googleMapsApiKey={googleMapsApiKey} cep={cep} />
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
