import { useSection } from "@deco/deco/hooks";
import { Color } from "apps/admin/widgets.ts";
import { AppContext } from "site/apps/site.ts";
import ProductSlider, {
  ProductSliderProps,
} from "site/components/product/ProductSlider.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";

/** @titleBy title */
export interface tab {
  title: string;
  backgroundColor: Color;
  slider: Omit<ProductSliderProps, "settings">;
}

interface TabLayoutProps {
  title: string;
  description: string;
  tabs: tab[];
  /**
   * @title Default Active Tab
   * @description The index of the tab that should be active by default, starting from 0
   */
  activeTab: number;
}

export function loader(props: TabLayoutProps, _req: Request, app: AppContext) {
  const shelfSettings = {
    colors: app.globalSettings.colors,
    cashbackPercentage: app.globalSettings.cashbackPercentage,
  };
  return {
    ...props,
    shelfSettings,
  };
}

export default function TabLayout(
  { activeTab, title, description, tabs, shelfSettings }: ReturnType<
    typeof loader
  >,
) {
  const currentTab = tabs[activeTab];
  const shelfId = useId();

  if (!currentTab.slider) return null;

  return (
    <div class="flex flex-col gap-10 container">
      <div class="flex justify-between mobile:flex-col">
        <span class="flex flex-col gap-4">
          <h2 class="font-beccaPerry mobile:text-[32px] mobile:leading-[38px] text-[44px] leading-[53px] font-medium text-accent">
            {title}
          </h2>
          <p class="text-accent text-base mobile:text-[13px] mobile:leading-[18px] font-medium">
            {description}
          </p>
        </span>

        <div class="flex mobile:justify-start justify-between desk:gap-6 desk:mt-0 items-center mobile:gap-0 mobile:mt-[30px]">
          {tabs.map((tab, index) => (
            <button
              style={{
                "--bgColor": currentTab.backgroundColor,
              }}
              hx-post={useSection({ props: { activeTab: index } })}
              hx-swap="outerHTML"
              hx-target="closest section"
              disabled={activeTab === index}
              class={clx(
                "desk:min-w-[159px] h-11 desk:rounded-lg flex items-center justify-center mobile:w-full text-xl desk:leading-6 mobile:text-sm font-bold",
                activeTab === index
                  ? "bg-[var(--bgColor)] text-white"
                  : "bg-[#F7F7F7] border-[#EFEFEF] desk:border text-accent hover:bg-secondary hover:border-secondary",
                index === 0
                  ? "mobile:rounded-l-lg"
                  : index === tabs.length - 1
                  ? "mobile:rounded-r-lg"
                  : "mobile:rounded-none",
              )}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div id={shelfId}>
        <ProductSlider {...currentTab.slider} settings={shelfSettings} />
      </div>
    </div>
  );
}
