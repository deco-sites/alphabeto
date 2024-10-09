import type { ImageWidget } from "apps/admin/widgets.ts";

interface Item {
    item: string
    href: string
    highlight?: boolean
}

interface Submenu {
    item: Item[]
    seeAll?: boolean
}
  
export interface Items {
    menuItem: string
    href: string
    image?: ImageWidget
    submenu?: Submenu[]
}