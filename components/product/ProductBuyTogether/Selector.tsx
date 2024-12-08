import { useScriptAsDataURI } from "@deco/deco/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { useId } from "site/sdk/useId.ts";

interface Props {
  values: {
    label: string;
    selected: boolean;
  }[];
  placeholder: string;
}

const load = (id: string) => {
  const element = document.getElementById(id);
  const container =
    element?.querySelector<HTMLButtonElement>("[data-container]");
  const itemsContainer = element?.querySelector<HTMLDivElement>(
    "[data-items-container]"
  );
  const items = element?.querySelectorAll<HTMLButtonElement>("[data-item]");
  const useSvg = container?.querySelector("use");
  if (!container || !items || !itemsContainer || !useSvg) return;

  container.addEventListener("click", () => {
    console.log(itemsContainer.style.height);
    if (itemsContainer.style.height === "0px") {
      itemsContainer.style.height = `${itemsContainer.scrollHeight}px`;
      const newIcon =
        useSvg
          .getAttribute("href")
          ?.replace(/#chevron-right/, "#chevron-down") ?? "";
      useSvg.setAttribute("href", newIcon);
    } else {
      itemsContainer.style.height = `0px`;
      const newIcon =
        useSvg
          .getAttribute("href")
          ?.replace(/#chevron-down/, "#chevron-right") ?? "";
      useSvg.setAttribute("href", newIcon);
    }
  });

  items.forEach((item) =>
    item.addEventListener("click", () => {
      itemsContainer.style.height = `0px`;
      const newIcon =
        useSvg
          .getAttribute("href")
          ?.replace(/#chevron-down/, "#chevron-right") ?? "";
      useSvg.setAttribute("href", newIcon);
    })
  );
};

export default function Selector({ values, placeholder }: Props) {
  const selectedValue = values.find((value) => value.selected);
  const id = useId();

  return (
    <div class="relative" id={id}>
      <button
        data-container
        class="border border-primary border-dashed rounded-lg h-10 bg-white flex items-center justify-between px-3 w-full"
      >
        <span class="text-sm text-[#676767]">
          {selectedValue?.label ?? placeholder}
        </span>
        <Icon id="chevron-right" class="text-primary min-w-[18px]" size={18} />
      </button>
      <div
        data-items-container
        class="transition-all bg-white absolute top-8 w-full z-10 overflow-hidden border-x border-primary border-dashed"
        style={{
          height: "0px",
        }}
      >
        <div class="border-b border-primary border-dashed mt-2">
          {values.map((value) => (
            <button
              class="h-10 flex items-center hover:bg-[#FDF6ED] px-3 cursor-pointer w-full"
              data-item
            >
              <span class="text-sm text-[#676767]">{value.label}</span>
            </button>
          ))}
        </div>
      </div>
      <script src={useScriptAsDataURI(load, id)} />
    </div>
  );
}
