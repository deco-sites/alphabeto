import type { ImageWidget as Image } from "apps/admin/widgets.ts";

export interface Item {
  item: string;
  href: string;
  highlight?: boolean;
}

export interface Submenu {
  item: Item[];
  seeAll?: boolean;
}

export interface Items {
  menuItem: string;
  href: string;
  image?: Image;
  submenu?: Submenu[];
}
