import { ExtendedFilterToggle } from "site/components/search/Filters/index.tsx";
import Icon from "site/components/ui/Icon.tsx";

interface SelectedFiltersProps {
  filters: ExtendedFilterToggle[];
}

export default function SelectedFilters(props: SelectedFiltersProps) {
  const values = props.filters.map((filter) => {
    const values = filter.values.filter((value) => value.selected);
    return values;
  }).flat();

  return (
    <li class="hidden desk:flex flex-col py-5 px-[17.5px] border border-secondary rounded bg-white">
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
              <Icon
                id="close"
                size={14}
                class="text-primary min-w-[14px]"
              />
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
