import { AnalyticsEvent } from "apps/commerce/types.ts";

type MenuClick = {
  name: 'menu_click';
  params: {
    name: string;
    url: string;
  }
};

type BannerClick = {
  name: 'banner_click';
  params: {
    url: string;
  }
};

type ExtendedAnalyticsEvent =
  AnalyticsEvent
  | MenuClick
  | BannerClick
;

export default ExtendedAnalyticsEvent;