import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { ColorItem } from "site/components/search/Filters/index.tsx";
import { RenderSearchInput } from "site/components/search/Filters/ShowItemWithCheckboxes.tsx";
import { clx } from "site/sdk/clx.ts";

const SHOW_QUANTITY = false;
const ITENS_TO_SCROLL = 4;
const CALCULATED_MAX_HEIGHT = (35 * ITENS_TO_SCROLL) +
    ((ITENS_TO_SCROLL - 1) * 5);

interface ItemProps {
    filterToogleValue: FilterToggleValue;
    hexadecimals?: string[];
}

interface Props {
    filter: FilterToggle;
    colorSettings: {
        colors: ColorItem[];
    };
}

function makeBackgroundFromHexadecimals(hexadecimals: string[]) {
    const percent = 100 / hexadecimals.length;
    return hexadecimals.map((hex, index) => {
        return `${hex} ${percent * index}% ${percent * (index + 1)}%`;
    }).join(", ");
}

function Item(
    {
        filterToogleValue: { url, selected, label, quantity, value },
        hexadecimals,
    }: ItemProps,
) {
    return (
        <a
            href={url}
            rel="nofollow"
            class={clx(
                "flex items-center px-2.5 py-[8.5px] gap-2.5 max-h-[35px] rounded min-h-[35px] max-w-[176px]",
                selected
                    ? "border-[#D6DE23] border"
                    : "border-[#F5F4F1] border-[0.5px]",
            )}
            data-value-name={value}
        >
            <div
                class={clx(
                    "w-[18px] h-[18px] rounded",
                    !(hexadecimals && hexadecimals.length > 0)
                        ? "border-primary border"
                        : "",
                )}
                style={{
                    background: hexadecimals
                        ? `linear-gradient(to right, ${
                            makeBackgroundFromHexadecimals(hexadecimals)
                        })`
                        : "",
                }}
            />
            <span class="text-xs leading-[18px] text-[#7E7F88]">
                {label} {SHOW_QUANTITY && quantity > 0 && `(${quantity})`}
            </span>
        </a>
    );
}

function findColorItem(value: string, colors: ColorItem[]) {
    const normalizeAll = (str: string) =>
        str.toLowerCase().normalize("NFD").replace(
            /[\u0300-\u036f]/g,
            "",
        );

    return colors.find((color) => {
        return normalizeAll(color.name).includes(normalizeAll(value));
    });
}

export default function ShowColorItem(
    { filter: { values }, colorSettings: { colors } }: Props,
) {
    const showInputAndScroll = values.length > ITENS_TO_SCROLL;
    return (
        <>
            {showInputAndScroll && <RenderSearchInput />}
            <ul
                class={clx(
                    `flex gap-[5px] flex-col mt-5`,
                    showInputAndScroll
                        ? `max-h-[var(--maxHeight)] overflow-y-auto customizeScroll`
                        : "",
                )}
                style={{ "--maxHeight": `${CALCULATED_MAX_HEIGHT}px` }}
            >
                {values.map((item) => {
                    const colorItem = findColorItem(item.value, colors);
                    return (
                        <Item
                            filterToogleValue={item}
                            hexadecimals={colorItem?.hexadecimals}
                        />
                    );
                })}
            </ul>
        </>
    );
}
