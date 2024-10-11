import type { ImageWidget as Image } from "apps/admin/widgets.ts";

interface Item {
    image: Image
    label: string
    href: string
}

export interface MinicartEmptyProps {
    title: string;
    icon?: Image;
    itemsTitle: string
    items: Item[]
}

export function MinicartEmpty(props: MinicartEmptyProps) {
    console.log({props})
    return <h1>Empty</h1>
}