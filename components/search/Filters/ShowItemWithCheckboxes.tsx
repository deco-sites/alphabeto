import { useScript } from "@deco/deco/hooks";
import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Icon from "site/components/ui/Icon.tsx";
import { CheckboxInput } from "site/components/ui/Input.tsx";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";

const SHOW_QUANTITY = false;
const ITENS_TO_SCROLL = 5;
const CALCULATED_MAX_HEIGHT = (21 * ITENS_TO_SCROLL) +
    ((ITENS_TO_SCROLL - 1) * 10);

function handleCheckboxChange() {
    event?.preventDefault();
    event?.stopPropagation();
    const target = event?.currentTarget as HTMLInputElement;
    target.parentElement?.click();
}

function Item(
    { url, selected, label, quantity, value }: FilterToggleValue,
) {
    return (
        <a
            href={url}
            rel="nofollow"
            class="flex items-center gap-2"
            data-value-name={value}
        >
            <CheckboxInput
                checked={selected}
                hx-on:change={useScript(handleCheckboxChange)}
            />
            <span class="text-xs leading-[18px] text-[#7E7F88]">
                {label} {SHOW_QUANTITY && quantity > 0 && `(${quantity})`}
            </span>
        </a>
    );
}

export function handleKeyInputSearch() {
    const target = event?.currentTarget as HTMLInputElement;
    const value = target.value.trim();
    const items = target.parentElement?.nextElementSibling?.querySelectorAll(
        "a",
    );
    if (!items) return;
    const fullNormalize = (str: string) =>
        str.toLowerCase().normalize("NFD").replace(
            /[\u0300-\u036f]/g,
            "",
        );
    if (!value || value.length === 0) {
        items.forEach((item) => {
            item.style.display = "flex";
        });
        return;
    }
    items.forEach((item) => {
        const itemValue = item.getAttribute("data-value-name");
        if (!itemValue) return;
        const isMatch = fullNormalize(itemValue).includes(fullNormalize(value));
        item.style.display = isMatch ? "flex" : "none";
    });
}

export function RenderSearchInput() {
    return (
        <div class="flex items-center rounded-lg w-full gap-2 p-2.5 mt-5 bg-[#F6F6F6]">
            <input
                type="text"
                class="w-full h-5 text-xs leading-[18px] text-[#676767] bg-transparent focus:outline-none"
                placeholder="O que você está buscando?"
                hx-on:input={useScript(handleKeyInputSearch)}
            />
            <Icon id="search" size={18} class="text-primary" />
        </div>
    );
}

export default function ShowItemWithCheckboxes({ key, values }: FilterToggle) {
    const showInputAndScroll = values.length > ITENS_TO_SCROLL;
    return (
        <>
            {showInputAndScroll && <RenderSearchInput />}
            <ul
                class={clx(
                    `flex gap-2.5 flex-col mt-5`,
                    showInputAndScroll
                        ? `max-h-[var(--maxHeight)] overflow-y-auto customizeScroll`
                        : "",
                )}
                style={{ "--maxHeight": `${CALCULATED_MAX_HEIGHT}px` }}
            >
                {values.map((item) => {
                    if (key === "price") {
                        const range = parseRange(item.value);
                        return range && (
                            <Item
                                {...item}
                                label={`${formatPrice(range.from)} - ${
                                    formatPrice(range.to)
                                }`}
                            />
                        );
                    }

                    return <Item {...item} />;
                })}
            </ul>
        </>
    );
}
