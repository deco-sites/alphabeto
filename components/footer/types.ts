import { ImageWidget, RichText } from "apps/admin/widgets.ts";

/** @title {{title}} */
export interface Item {
  title: string;
  /** @title URL */
  href: string;
}

/** @title {{title}} */
export interface Menu {
  title: string;
  /** @title URL */
  href: string;
  itens: Item[];
}

/** @title {{title}} */
export interface SocialLogo {
  title: string;
  logo: ImageWidget;
}

export interface Column {
  menus: Menu[];
  socialLogos?: SocialLogo[];
}

export interface Newsletter {
  title: RichText;
  description?: string;
  /** @hide true */
  formState?: "idle" | "success" | "error";
}

export interface Card {
  title: string;
  badge?: string;
  description: string;
  button: {
    text: string;
    href: string;
  };
  image: {
    desktop: ImageWidget;
    mobile: ImageWidget;
  };
}

export interface TecnologiesLogo {
  econverse: ImageWidget;
  vtex: ImageWidget;
}
/** @title {{title}} */
export interface CardFlag {
  title: string;
  image: ImageWidget;
}

export interface Props {
  newsletter: Newsletter;
  columns: Column[];
  card: Card;
  tecnologiesLogo: TecnologiesLogo;
  copyright: string;
  cardFlags: CardFlag[];
}
