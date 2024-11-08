import { useId } from "site/sdk/useId.ts";
import { Section } from "@deco/deco/blocks";
import { useSection } from "@deco/deco/hooks";

export interface tab {
  label: string;
  title: string;
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
  const tab = tabs[activeTab];
  const shelfId = useId();

  if (!tab.section) return null;

  return (
    <div>
      <div>
        <span>
          <h2>{title}</h2>
          <p>{description}</p>
        </span>

        <div>
          {tabs.map((tab, index) => (
              <button
                hx-post={useSection({ props: { activeTab: index } })}
                hx-swap="outerHTML"
                hx-target="closest section"
              >
                {tab.label}
              </button>
            )
          )}
        </div>

        <div id={shelfId}>
          <tab.section.Component {...tab.section.props} />
        </div>
      </div>
    </div>
  );
}
