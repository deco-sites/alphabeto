import { Device } from "@deco/deco/utils";
import { AnalyticsEvent } from "apps/commerce/types.ts";

type Common = {
  params: {
    device: Device;
    url: string;
  }
};

type MenuClick = Common & {
  name: 'menu_click';
  params: {
    name: string;
  }
};

type SubmenuClick = Common & {
  name: 'submenu_click';
};

type MainBannerClick = Common & {
  name: 'banner_principal_click';
  params: {
    index: number;
  }
};

type MiniBannerClick = Common & {
  name: 'mini_banner_click';
};

type ExtendedAnalyticsEvent =
  AnalyticsEvent
  | MenuClick
  | SubmenuClick
  | MainBannerClick
  | MiniBannerClick
;

export default ExtendedAnalyticsEvent;