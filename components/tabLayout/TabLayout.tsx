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
      <div class="flex justify-between px-10">
        <span class="flex flex-col gap-4">
          <h2 class="font-['BeccaPerry'] text-[44px] font-medium text-[#676767]">
            {title}
          </h2>
          <p class="text-[#676767] text-base font-medium">{description}</p>
        </span>

        <div class="flex justify-between gap-6 items-center">
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
              class="max-w-40 h-11 px-10 flex items-center justify-center rounded-lg hover:!bg-[#F7E0BF] text-xl font-bold"
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
