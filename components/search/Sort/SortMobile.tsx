import { useScript } from "@deco/deco/hooks";
import { Props, useSortData } from "site/components/search/Sort/common.ts";
import Icon from "site/components/ui/Icon.tsx";
import { CheckboxInput } from "site/components/ui/Input.tsx";
import Modal from "site/components/ui/Modal.tsx";
import { useId } from "site/sdk/useId.ts";

function SortMobile(props: Props) {
  const { options } = useSortData(props);
  const id = useId();
  return (
    <div>
      <label
        for={id}
        class="flex bg-secondary-content rounded-[0px_4px_4px_0px] text-xs font-bold leading-[18px] text-accent gap-2.5 h-10 items-center justify-center"
      >
        <Icon id="sort" size={16} className="text-primary" />
        Ordernar por
      </label>
      <Modal id={id}>
        <div class="flex flex-col bg-white rounded-lg p-5 gap-2.5 absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4">
          {options.map(({ isCurrent, textLabel, value }) => (
            <a
              class="flex gap-2.5 items-center text-xs font-bold leading-[18px] text-accent"
              href={value}
            >
              <CheckboxInput
                checked={isCurrent}
                hx-on:change={useScript((value) => {
                  event?.preventDefault();
                  window.location.href = value;
                }, value)}
              />
              {textLabel}
            </a>
          ))}
        </div>
      </Modal>
    </div>
  );
}
export default SortMobile;
