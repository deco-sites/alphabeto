import type {
  Filter,
  FilterToggle,
  ProductListingPage,
} from "apps/commerce/types.ts";
import BottomFilterBar from "site/components/search/Filters/BottomFilterBar.tsx";
import RenderFilterItem from "site/components/search/Filters/RenderFilterItem.tsx";
import SelectedFilters from "site/components/search/Filters/SelectedFilters.tsx";
import { ExportedColorItem } from "site/loaders/savedColors.ts";

export interface FilterSettings {
  colors: ExportedColorItem[];
}

interface Props {
  filters: ProductListingPage["filters"];
  settings: FilterSettings;
  url: string;
}

export interface ExtendedFilterToggle extends FilterToggle {
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
    <>
      <ul class="flex overflow-auto desk:overflow-[unset] flex-col desk:gap-6 px-6 pt-1.5 desk:pt-0 desk:px-0 h-[calc(100dvh_-_50px_-_72px)] desk:h-[unset] bg-base-100 desk:bg-[unset] w-full desk:w-auto">
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
      <BottomFilterBar />
    </>
  );
}

export default Filters;
