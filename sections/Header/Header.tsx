import type { ImageWidget } from "apps/admin/widgets.ts";
import Links from "../../components/header/Links.tsx";
import { type SearchbarProps } from "../../components/search/Searchbar/Form.tsx";

import { type LoadingFallbackProps } from "@deco/deco";
import { useDevice } from "@deco/deco/hooks";
import { Suggestion } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import BenefitBar, { BenefitBarProps } from "../../components/header/BenefitBar.tsx";
import { Desktop } from "../../components/header/HeaderDesktop.tsx";
import { Mobile } from "../../components/header/HeaderMobile.tsx";
import { Items } from "../../components/header/Menu.types.ts";
import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE } from "../../constants.ts";
import { ComponentProps } from "../Component.tsx";

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

/**@title {{title}} */
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

export const loader = async (props: SectionProps, _req: Request, ctx: AppContext) => {
  const {
    searchbar: {
      topSearch: { __resolveType, ...topSearchProps },
      ...otherSearchProps
    },
    ...otherProps
  } = props;

  const topSearchResult = (await ctx.invoke(__resolveType, {
    ...topSearchProps,
  })) as Suggestion;

  return {
    ...otherProps,
    searchbar: {
      ...otherSearchProps,
      topSearch: topSearchResult,
    },
  };
};

export type Props = ComponentProps<typeof loader>;

function Header({ links = [], logo, benefits, ...props }: Props) {
  const device = useDevice();
  const RenderBenefits = () => {
    if (benefits?.benefits && benefits.benefits.length > 0) {
      return <BenefitBar benefits={benefits.benefits} interval={benefits.interval} />;
    }
    return null;
  };
  const showLinks = links.length > 0 && device === "desktop";

  return (
    <header
      style={{
        height: device === "desktop" ? HEADER_HEIGHT_DESKTOP : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-base-100 fixed w-full z-40">
        {device === "mobile" && <RenderBenefits />}
        {showLinks && <Links links={links} />}
        {device === "desktop" ? <Desktop logo={logo} {...props} /> : <Mobile logo={logo} {...props} links={links} />}
        {device === "desktop" && <RenderBenefits />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="lazy" />
);
export default Header;
