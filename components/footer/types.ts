import { ImageWidget, RichText } from "apps/admin/widgets.ts";

/** @title {{title}} */
export interface Item {
  title: string;
  /** @title URL */
  href: string;
  openInNewTab?: boolean;
}

/** @title {{title}} */
export interface Menu {
  title: string;
  /** @title URL */
  href?: string;
  itens: Item[];
}

/** @title {{title}} */
export interface SocialLogo {
  title: string;
  logo: ImageWidget;
  /** @title URL */
  url: string;
}

export interface Column {
  menus: Menu[];
  socialLogos?: SocialLogo[];
}

export interface Newsletter {
  title: RichText;
  description?: string;
  image?: ImageWidget; 
  /** @hide true */
  formState?: "idle" | "success" | "error";
}

export interface CardImage {
  desktop: ImageWidget;
  mobile: ImageWidget;
  /** @title Alternative Text */
  alt: string;
}

export interface CardButton {
  text: string;
  /** @title URL */
  href: string;
}

export interface Card {
  title: string;
  badge?: string;
  description: string;
  button: CardButton;
  image: CardImage;
}

export interface TecnologiesLogo {
  econverse: {
    image: ImageWidget;
    /** @title URL */
    url: string;
  };
  vtex: {
    image: ImageWidget;
    /** @title URL */
    url: string;
  };
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
