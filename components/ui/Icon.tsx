import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "search"
  | "shopping_bag"
  | "menu"
  | "account_circle"
  | "close"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "chevron-right-institutional"
  | "chevron-up"
  | "favorite"
  | "home_pin"
  | "home_icon"
  | "home_icon"
  | "call"
  | "local_shipping"
  | "pan_zoom"
  | "share"
  | "sell"
  | "check-circle"
  | "error"
  | "trash"
  | "location_pin"
  | "close-search"
  | "logo_store"
  | "plus"
  | "minus"
  | "cashback-coin"
  | "hanger"
  | "ruler"
  | "hearth-unfill"
  | "hearth-fill"
  | "whatsappIcon"
  | "castle"
  | "star"
  | "minor-star"
  | "home-breadcrumb"
  | "cat_sort_orders:desc"
  | "cat_sort_price:asc"
  | "cat_sort_price:desc"
  | "cat_sort_release:desc"
  | "cat_sort_relevance:desc"
  | "cat_sort_name:asc"
  | "cat_sort_name:desc"
  | "cat_sort_discount:desc"
  | "sort"
  | "filter"
  | "stars-cat-1-desktop"
  | "stars-cat-2-desktop"
  | "stars-cat-1-mobile"
  | "stars-cat-2-mobile"
  | "eye"
  | "refresh"
  | "equals"
  | "rotative_sum"
  | "rotative_star"
  | "rotative_moon"
  | "share_whatsapp"
  | "share_facebook"
  | "share_email"
  | "product_care_wash"
  | "product_care_bleach"
  | "product_care_spin"
  | "product_care_iron"
  | "product_care_dry_cleaning"
  | "product_rating_star"
  | "arrow-with-twirls"
  | "arrow-with-twirls-2"
  | "arrow-right"
  | "single-star"
  | "triangle-interactive-banner-desktop";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="search" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon({ id, size = 24, width, height, ...otherProps }: Props) {
  return (
    <svg {...otherProps} width={width ?? size} height={height ?? size}>
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
