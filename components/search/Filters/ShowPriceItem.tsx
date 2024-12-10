import { FilterToggle } from "apps/commerce/types.ts";
import { useCallback } from "preact/hooks";
import { FilterMobileLogics } from "site/components/search/Filters/BottomFilterBar.tsx";
import MultiRangeSlider from "site/components/ui/MultiRangeSlider.tsx";

declare global {
    interface Window {
        FILTER_LOGICS: FilterMobileLogics;
    }
}

export interface Props {
    filterToogle: FilterToggle;
    url: string;
}

export default function ShowPriceItem(props: Props) {
    const { filterToogle: { values }, url: currentUrl } = props;

    const minPrice = values[0].value.split(":")[0];
    const maxPrice = values[values.length - 1].value.split(":")[1];

    const currentUrlObject = new URL(currentUrl);
    const currentPrice = currentUrlObject.searchParams.get("filter.price");
    const min = currentPrice ? currentPrice.split(":")[0] : minPrice;
    const max = currentPrice ? currentPrice.split(":")[1] : maxPrice;

    const changeUrl = useCallback((min: number, max: number) => {
        window.FILTER_LOGICS.updatePriceFilter(min, max, values[0].url);
    }, [values]);

    return (
        <div>
            <MultiRangeSlider
                maxVal={max}
                minVal={min}
                max={maxPrice}
                min={minPrice}
                step="0.01"
                onChange={changeUrl}
            />
        </div>
    );
}
