import { useScript } from "@deco/deco/hooks";
import { FilterToggle } from "apps/commerce/types.ts";
import { FilterSettings } from "site/components/search/Filters/index.tsx";
import ShowColorItem from "site/components/search/Filters/ShowColorItem.tsx";
import ShowItemWithCheckboxes from "site/components/search/Filters/ShowItemWithCheckboxes.tsx";
import Icon from "site/components/ui/Icon.tsx";
import ShowPriceItem from "site/islands/ShowPriceItem.tsx";
import { useId } from "site/sdk/useId.ts";

const DEFAULT_CLOSED_FILTERS = [
    "category-2",
    "tamanho",
];

interface RenderFilterItemProps {
    filter: FilterToggle;
    colorSettings: FilterSettings;
    url: string;
}

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
export default function RenderFilterItem(props: RenderFilterItemProps) {
    const id = useId();

    const isClosed = DEFAULT_CLOSED_FILTERS.includes(props.filter.key);
    const icon = isClosed ? "chevron-down" : "chevron-right";
    const height = isClosed ? "0px" : "auto";

    return (
        <li class="flex flex-col py-4 desk:py-5 desk:px-[17.5px] [&:not(:last-child)]:border-b border-secondary border-dashed desk:border-solid desk:border desk:border-secondary desk:rounded desk:bg-white">
            <button
                class="flex justify-between"
                hx-on:click={useScript(handleToogle, id)}
            >
                <span class="text-xs leading-[18px] text-[#676767] font-bold">
                    {props.filter.label}
                </span>
                <Icon id={icon} size={18} class="text-[#D6DE23]" />
            </button>
            <div
                class="transition-all overflow-hidden"
                id={id}
                style={{ height }}
            >
                {props.filter.key === "cor"
                    ? (
                        <ShowColorItem
                            filter={props.filter}
                            colorSettings={props.colorSettings}
                        />
                    )
                    : props.filter.key === "price"
                    ? (
                        <ShowPriceItem
                            filterToogle={props.filter}
                            url={props.url}
                        />
                    )
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
