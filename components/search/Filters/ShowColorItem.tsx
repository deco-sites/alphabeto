import { useScript } from "@deco/deco/hooks";
import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { FilterMobileLogics } from "site/components/search/Filters/BottomFilterBar.tsx";
import { RenderSearchInput } from "site/components/search/Filters/ShowItemWithCheckboxes.tsx";
import { ExportedColorItem } from "site/loaders/savedColors.ts";
import { clx } from "site/sdk/clx.ts";
import { makeBackgroundFromHexadecimals } from "site/sdk/makeBackgroundFromHexadecimals.ts";

const SHOW_QUANTITY = false;
const ITENS_TO_SCROLL = 4;
const CALCULATED_MAX_HEIGHT = 35 * ITENS_TO_SCROLL + (ITENS_TO_SCROLL - 1) * 5;

interface ItemProps {
  filterToogleValue: FilterToggleValue;
  hexadecimals?: string[];
  keyValue: string;
}

interface Props {
  filter: FilterToggle;
  colorSettings: {
    colors: ExportedColorItem[];
  };
}

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
  if (selected) {
    target.classList.remove("border-[#D6DE23]", "border");
    target.classList.add("border-[#F5F4F1]", "border-[0.5px]");
  } else {
    target.classList.remove("border-[#F5F4F1]", "border-[0.5px]");
    target.classList.add("border-[#D6DE23]", "border");
  }
  target.setAttribute("data-selected", String(!selected));
}

function Item({
  filterToogleValue: { url, selected, label, quantity, value },
  hexadecimals,
  keyValue,
}: ItemProps) {
  return (
    <button
      data-url={url}
      data-selected={String(selected)}
      data-value-key={keyValue}
      data-value-name={value}
      hx-on:click={useScript(handleButtonPress)}
      class={clx(
        "flex items-center px-2.5 py-[8.5px] gap-2.5 max-h-[35px] rounded min-h-[35px] max-w-[176px]",
        selected
          ? "border-[#D6DE23] border"
          : "border-[#F5F4F1] border-[0.5px]",
      )}
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
            ? makeBackgroundFromHexadecimals(hexadecimals)
            : "",
        }}
      />
      <span class="text-xs leading-[18px] text-[#7E7F88]">
        {label} {SHOW_QUANTITY && quantity > 0 && `(${quantity})`}
      </span>
    </button>
  );
}

function findColorItem(value: string, colors: ExportedColorItem[]) {
  const normalizeAll = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  return colors.find((color) => {
    return normalizeAll(color.name).includes(normalizeAll(value));
  });
}

export default function ShowColorItem({
  filter: { values, key },
  colorSettings: { colors },
}: Props) {
  const showInputAndScroll = values.length > ITENS_TO_SCROLL;
  return (
    <>
      {showInputAndScroll && <RenderSearchInput />}
      <ul
        class={clx(
          `flex gap-[5px] flex-col mt-4 desk:mt-5`,
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
              keyValue={key}
              filterToogleValue={item}
              hexadecimals={colorItem?.hexadecimals}
            />
          );
        })}
      </ul>
    </>
  );
}
