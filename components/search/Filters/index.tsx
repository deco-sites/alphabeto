import { useScript } from "@deco/deco/hooks";
import type {
  Filter,
  FilterToggle,
  ProductListingPage,
} from "apps/commerce/types.ts";
import ShowColorItem from "site/components/search/Filters/ShowColorItem.tsx";
import ShowItemWithCheckboxes from "site/components/search/Filters/ShowItemWithCheckboxes.tsx";
import Icon from "site/components/ui/Icon.tsx";
import ShowPriceItem from "site/islands/ShowPriceItem.tsx";
import { useId } from "site/sdk/useId.ts";

/** @title {{name}} */
export interface ColorItem {
  name: string;
  hexadecimals: string[];
}

export interface FilterSettings {
  colors: ColorItem[];
}

interface Props {
  filters: ProductListingPage["filters"];
  settings: FilterSettings;
  url: string;
}

interface ExtendedFilterToggle extends FilterToggle {
  colorSettings: FilterSettings;
}

const FILTER_ORDER = [
  "category-1",
  "category-2",
  "category-3",
  "tamanho",
  "cor",
  "price",
  "brand",
];

const FILTERS_TO_HIDE = [
  "brand",
];
const FILTERS_TO_RENAME = {
  "category-2": "Faixa Etária",
};

const DEFAULT_CLOSED_FILTERS = [
  "category-2",
  "tamanho",
];

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";
const applyOrder = (a: Filter, b: Filter) =>
  FILTER_ORDER.indexOf(a.key) - FILTER_ORDER.indexOf(b.key);
const applyHide = (filter: Filter) => !FILTERS_TO_HIDE.includes(filter.key);
const applyRename = (filter: Filter) => ({
  ...filter,
  label: FILTERS_TO_RENAME[filter.key as keyof typeof FILTERS_TO_RENAME] ||
    filter.label,
});
type SanitizerFn = (value: string) => string;
const upperCaseFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
const sanitizeValueLabelFromFilter = (
  filterkey: string,
  sanitizer: SanitizerFn,
) => {
  return (filter: FilterToggle) => {
    if (filter.key === filterkey) {
      filter.values = filter.values.map((value) => ({
        ...value,
        label: sanitizer(value.label),
      }));
    }
    return filter;
  };
};

function handleToogle(id: string) {
  const sideElement = document.getElementById(id);
  if (!sideElement) return;
  const height = sideElement.scrollHeight;
  const isClosed = sideElement.style.height === "0px";
  sideElement.style.height = isClosed ? `${height}px` : "0px";
  const svg = sideElement.previousElementSibling?.querySelector("svg");
  const use = svg?.querySelector("use");
  if (!use) return;
  const attr = use?.getAttribute("href");
  if (!attr) return;
  const [contents] = attr.split("#");
  use.setAttribute(
    "href",
    `${contents}#${isClosed ? "chevron-right" : "chevron-down"}`,
  );
}

function enableToogler(id: string, isClosed: boolean) {
  const sideElement = document.getElementById(id);
  if (!sideElement) {
    return;
  }
  const height = sideElement.scrollHeight;
  sideElement.style.height = isClosed ? "0px" : `${height}px`;
}

interface RenderFilterItemProps {
  filter: FilterToggle;
  colorSettings: FilterSettings;
  url: string;
}

function RenderFilterItem(props: RenderFilterItemProps) {
  const id = useId();

  const isClosed = DEFAULT_CLOSED_FILTERS.includes(props.filter.key);
  const icon = isClosed ? "chevron-down" : "chevron-right";
  const height = isClosed ? "0px" : "auto";

  return (
    <li class="flex flex-col py-5 px-[17.5px] border border-secondary rounded bg-white">
      <button
        class="flex justify-between"
        hx-on:click={useScript(handleToogle, id)}
      >
        <span class="text-sm text-[#676767] font-bold">
          {props.filter.label}
        </span>
        <Icon id={icon} size={18} class="text-[#D6DE23]" />
      </button>
      <div class="transition-all overflow-hidden" id={id} style={{ height }}>
        {props.filter.key === "cor"
          ? (
            <ShowColorItem
              filter={props.filter}
              colorSettings={props.colorSettings}
            />
          )
          : props.filter.key === "price"
          ? <ShowPriceItem filterToogle={props.filter} url={props.url} />
          : <ShowItemWithCheckboxes {...props.filter} />}
      </div>
      <script
        async
        dangerouslySetInnerHTML={{
          __html: useScript(enableToogler, id, isClosed),
        }}
      />
    </li>
  );
}

interface SelectedFiltersProps {
  filters: ExtendedFilterToggle[];
}

function SelectedFilters(props: SelectedFiltersProps) {
  const values = props.filters.map((filter) => {
    const values = filter.values.filter((value) => value.selected);
    return values;
  }).flat();

  return (
    <li class="flex flex-col py-5 px-[17.5px] border border-secondary rounded bg-white">
      <span class="text-sm text-[#676767] font-bold">
        Filtrado por:
      </span>
      <ul class="flex flex-wrap gap-2.5 mt-2.5">
        {values.map((value) => (
          <li>
            <a
              href={value.url}
              class="text-xs leading-[14.4px] text-[#676767] bg-secondary px-2.5 py-1.5 flex items-center gap-1.5 rounded"
            >
              {value.label}
              <Icon id="close" size={14} class="text-primary min-w-[14px]" />
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

function Filters({ filters, settings, url }: Props) {
  const filtersSanitized = filters
    .sort(applyOrder)
    .filter(applyHide)
    .map(applyRename)
    .filter(isToggle)
    .map(sanitizeValueLabelFromFilter("cor", upperCaseFirstLetter))
    .map<ExtendedFilterToggle>((filter) => ({
      ...filter,
      colorSettings: settings,
    }));

  const selectedFilters = filtersSanitized.filter((filter) => {
    const selectedValue = filter.values.find((value) => value.selected);
    return selectedValue ? true : false;
  });

  return (
    <ul class="flex flex-col gap-6 p-4 desk:p-0">
      {selectedFilters.length > 0 && (
        <SelectedFilters filters={selectedFilters} />
      )}
      {filtersSanitized.map((filter) => (
        <RenderFilterItem
          filter={filter}
          colorSettings={settings}
          url={url}
        />
      ))}
    </ul>
  );
}

export default Filters;
