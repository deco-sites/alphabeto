import type { ImageWidget as Image } from "apps/admin/widgets.ts";

/** @title {{item}} */
export interface Item {
  item: string;
  href: string;
  highlight?: boolean;
}

export interface Submenu {
  item: Item[];
  seeAll?: boolean;
}

/** @title {{menuItem}} */
export interface Items {
  menuItem: string;
  href: string;
  image?: Image;
  submenu?: Submenu[];
}
