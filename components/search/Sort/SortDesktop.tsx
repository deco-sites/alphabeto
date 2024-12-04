import { Props, useSortData } from "site/components/search/Sort/common.ts";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";

function SortDesktop(props: Props) {
  const { options } = useSortData(props);
  return (
    <div class="py-5 px-[17.5px] border border-secondary rounded bg-white">
      <p class="text-sm text-[#676767] font-bold">Ordernar por</p>
      <div class="grid grid-cols-3 gap-x-2.5 gap-y-5 mt-5">
        {options.map(({ value, textLabel, icon, isCurrent }) => (
          <a
            href={value}
            class="flex items-center gap-2 flex-col text-center max-w-[70px]"
          >
            <div
              class={clx(
                "rounded-full border w-10 h-10 flex items-center justify-center",
                isCurrent
                  ? "bg-[#D6DE2333] text-primary border-[#D6DE23]"
                  : "text-[#676767] border-[#676767]",
              )}
            >
              <Icon id={icon} size={20} />
            </div>
            <span
              class={clx(
                "text-xs leading-[18px] font-bold",
                isCurrent ? "text-[#D6DE23]" : "text-[#676767]",
              )}
            >
              {textLabel}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
export default SortDesktop;
