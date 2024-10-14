import type { ImageWidget } from "apps/admin/widgets.ts";
import Links from "../../components/header/Links.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";

import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
import { Items } from "../../components/header/Menu.types.ts";
import { Desktop } from "../../components/header/HeaderDesktop.tsx";
import { Mobile } from "../../components/header/HeaderMobile.tsx";
import BenefitBar, {
  BenefitBarProps,
} from "../../components/header/BenefitBar.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface LinksProps {
  title: string;
  href: string;
}

export interface SectionProps {
  links?: LinksProps[];

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

  benefits?: BenefitBarProps;
}
export type Props = Omit<SectionProps, "alert">;

function Header({
  links = [],
  logo,
  benefits,
  ...props
}: Props) {
  const device = useDevice();

  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-base-100 fixed w-full z-40">
        {links.length > 0 && <Links links={links} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}

        {benefits?.benefits && benefits.benefits.length > 0 &&
          (
            <BenefitBar
              benefits={benefits.benefits}
              interval={benefits.interval}
            />
          )}
      </div>

    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...props as any} loading="lazy" />
);
export default Header;
