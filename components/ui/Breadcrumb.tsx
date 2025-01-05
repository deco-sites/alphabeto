import type { BreadcrumbList } from "apps/commerce/types.ts";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { relative } from "../../sdk/url.ts";

type ItemListElement = BreadcrumbList["itemListElement"];
type BreadcrumbItem = ItemListElement[0];

/** @title {{name}} */
export interface BreadcrumbOverride {
  name: string;
  url: string;
}

interface Props {
  itemListElement: ItemListElement;
  breadcrumbOverride?: BreadcrumbOverride[];
}

function BreadcrumbItem({ name, item }: BreadcrumbItem) {
  const classes: string[] = [];
  if (name === "Home") {
    classes.push("text-primary", "uppercase");
  }
  const iconId = name === "Home" ? "home-breadcrumb" : null;
  return (
    <li className={clx(...classes)}>
      {iconId && <Icon id={iconId} className="w-4 h-4 inline-block mr-[2px]" />}
      <a href={relative(item)}>{name}</a>
    </li>
  );
}

function Breadcrumb({ itemListElement = [], breadcrumbOverride }: Props) {
  const homeItem: BreadcrumbItem = {
    "@type": "ListItem",
    position: 0,
    name: "Home",
    item: "/",
  };
  const items = [
    homeItem,
  ];

  if (breadcrumbOverride && breadcrumbOverride.length) {
    const overrideItems = breadcrumbOverride.map<BreadcrumbItem>((
      item,
      index,
    ) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    }));
    items.push(...overrideItems);
  } else {
    items.push(...itemListElement.map((item, index) => ({
      ...item,
      position: index + 1,
    })));
  }

  return (
    <div class="breadcrumbs py-0 text-xs font-normal text-[#353535]">
      <ul>
        {items
          .filter(({ name, item }) => name && item)
          .map((item) => <BreadcrumbItem {...item} />)}
      </ul>
    </div>
  );
}

export default Breadcrumb;
