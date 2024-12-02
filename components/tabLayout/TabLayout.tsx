import { useId } from "site/sdk/useId.ts";
import { Section } from "@deco/deco/blocks";
import { useSection } from "@deco/deco/hooks";

export interface tab {
  label: string;
  title: string;
  backgroundColor: string;
  section: Section;
}

interface TabLayoutProps {
  title: string;
  description: string;
  tabs: tab[];
  activeTab: number;
}

export default function TabLayout(
  { activeTab, title, description, tabs }: TabLayoutProps,
) {
  const currentTab = tabs[activeTab];
  const shelfId = useId();

  if (!currentTab.section) return null;

  return (
    <div class="flex flex-col gap-10">
      <div class="flex justify-between desk:px-10 mobile:px-4 mobile:flex-col">
        <span class="flex flex-col gap-4">
          <h2 class="font-['BeccaPerry'] text-[44px] font-medium text-[#676767]">
            {title}
          </h2>
          <p class="text-[#676767] text-base font-medium">{description}</p>
        </span>

        <div class="flex mobile:justify-start justify-between desk:gap-6 desk:mt-0 items-center mobile:gap-0 mobile:mt-4">
          {tabs.map((tab, index) => (
            <button
              style={{
                background: activeTab === index
                  ? `${currentTab.backgroundColor} !important`
                  : "#F7F7F7",
                color: activeTab === index ? "#FFF" : "#676767",
              }}
              hx-post={useSection({ props: { activeTab: index } })}
              hx-swap="outerHTML"
              hx-target="closest section"
              class={`max-w-40 h-11 desk:px-10 mobile:px-0 desk:rounded-lg flex items-center justify-center mobile:w-full hover:!bg-[#F7E0BF] text-xl mobile:text-sm font-bold ${
                index === 0
                  ? "mobile:rounded-l-lg"
                  : index === tabs.length - 1
                  ? "mobile:rounded-r-lg"
                  : "mobile:rounded-none"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div id={shelfId}>
        <currentTab.section.Component {...currentTab.section.props} />
      </div>
    </div>
  );
}
