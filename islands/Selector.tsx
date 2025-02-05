import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";

type SelectProps =
  & React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
  & Record<string, unknown>;

interface Props {
  values: {
    value: string;
    label: string;
    selected: boolean;
  }[];
  onChange?: (value: string) => void;
  placeholder: string;
  selectProps?: SelectProps;
  posTop?: boolean;
}

export default function Selector({
  values,
  placeholder,
  selectProps,
  onChange,
  posTop = false,
}: Props) {
  const id = useId();
  const selectedValue = values.find((value) => value.selected);
  const handleToogle = () => {
    const itensContainer = document.querySelector<HTMLDivElement>(
      `#${id} #items-container`,
    );
    if (!itensContainer) return;
    const currentHeight = itensContainer.style.height;
    if (currentHeight === "0px") {
      const height = itensContainer.scrollHeight;
      itensContainer.style.height = `${height}px`;
    } else {
      itensContainer.style.height = "0px";
    }
  };
  const handleItemClick = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      const select = document.querySelector<HTMLSelectElement>(`#${id} select`);
      const itemNameElement = document.querySelector<HTMLSpanElement>(
        `#${id} #itemName`,
      );
      if (!select || !itemNameElement) return;
      const itemPos = values.findIndex((item) => item.value === value);
      const itemName = values[itemPos].label;
      itemNameElement.innerHTML = itemName;
      select.selectedIndex = itemPos;
      select.dispatchEvent(new Event("change"));
    }
    handleToogle();
  };
  return (
    <div class="relative" id={id}>
      <select {...selectProps} class="hidden">
        {values.map((value) => (
          <option value={value.value} selected={value.selected} />
        ))}
      </select>
      <button
        type="button"
        onClick={handleToogle}
        class="border border-primary border-dashed rounded-lg h-10 bg-white flex items-center justify-between px-3 w-full"
      >
        <span class="text-sm text-accent" id="itemName">
          {selectedValue?.label ?? placeholder}
        </span>
        <Icon id="chevron-right" class="text-primary min-w-[18px]" size={18} />
      </button>
      <div
        id="items-container"
        class={clx(
          "transition-all bg-white absolute w-full z-10 overflow-hidden border-x border-primary border-dashed",
          posTop ? "bottom-8" : "top-8",
        )}
        style={{
          height: "0px",
        }}
      >
        <div
          class={clx(
            "border-primary border-dashed",
            posTop ? "border-t mb-2" : "border-b mt-2",
          )}
        >
          {values.map((value) => (
            <button
              class="h-10 flex items-center hover:bg-secondary-content px-3 cursor-pointer w-full"
              type="button"
              onClick={() => handleItemClick(value.value)}
            >
              <span class="text-sm text-accent text-left">
                {value.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
