import { useScript } from "@deco/deco/hooks";
import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { FilterMobileLogics } from "site/components/search/Filters/BottomFilterBar.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { CheckboxInput } from "site/components/ui/Input.tsx";
import { clx } from "site/sdk/clx.ts";

const SHOW_QUANTITY = false;
const ITENS_TO_SCROLL = 5;
const CALCULATED_MAX_HEIGHT = (21 * ITENS_TO_SCROLL) +
  ((ITENS_TO_SCROLL - 1) * 10);

declare global {
  interface Window {
    FILTER_LOGICS: FilterMobileLogics;
  }
}

function handleButtonPress() {
  const target = event?.currentTarget as HTMLButtonElement;
  const url = target.getAttribute("data-url");
  const key = target.getAttribute("data-value-key");
  const value = target.getAttribute("data-value-name");
  const selected = target.getAttribute("data-selected") === "true";
  if (!key || !value || !url) return;
  window.FILTER_LOGICS.filterChange(key, value, url, selected);
  const input = target.querySelector("input");
  if (!input) return;
  input.checked = !selected;
  target.setAttribute("data-selected", String(!selected));
}

interface FilterItem {
  toogleValue: FilterToggleValue;
  keyValue: string;
}

function Item(
  { toogleValue: { selected, label, quantity, value, url }, keyValue }:
    FilterItem,
) {
  return (
    <button
      data-url={url}
      data-selected={String(selected)}
      data-value-key={keyValue}
      data-value-name={value}
      class="flex items-center gap-2"
      hx-on:click={useScript(handleButtonPress)}
    >
      <CheckboxInput
        checked={selected}
      />
      <span class="text-xs leading-[18px] text-[#7E7F88] text-left">
        {label} {SHOW_QUANTITY && quantity > 0 && `(${quantity})`}
      </span>
    </button>
  );
}

export function handleKeyInputSearch() {
  const target = event?.currentTarget as HTMLInputElement;
  const value = target.value.trim();
  const items = target.parentElement?.nextElementSibling?.querySelectorAll(
    "button",
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
    <div class="flex items-center rounded-lg w-full gap-2 p-2.5 mt-4 desk:mt-5 bg-[#F6F6F6]">
      <input
        type="text"
        class="w-full h-5 text-xs leading-[18px] text-accent bg-transparent focus:outline-none"
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
          `flex gap-2.5 flex-col mt-4 desk:mt-5`,
          showInputAndScroll
            ? `max-h-[var(--maxHeight)] overflow-y-auto customizeScroll`
            : "",
        )}
        style={{ "--maxHeight": `${CALCULATED_MAX_HEIGHT}px` }}
      >
        {values.map((item) => {
          return <Item toogleValue={item} keyValue={key} />;
        })}
      </ul>
    </>
  );
}
