import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";

interface Props {
  title: string;
  content?: string | null;
  defaultOpen?: boolean;
}

const textStyles = {
  open: "text-primary",
  closed: "text-[#676767]",
};

export default function ProductTextInfoDiscloujure({
  title,
  content,
  defaultOpen,
}: Props) {
  const isOpen = useSignal(defaultOpen);
  const calculatedOpenHeight = useSignal("auto");
  const contentId = useId();
  useEffect(() => {
    const element = document.querySelector<HTMLParagraphElement>(
      `#${contentId}`,
    );
    if (!element) return;
    calculatedOpenHeight.value = `${element.scrollHeight}px`;
  }, [contentId]);
  if (!content) return null;
  return (
    <div class="flex flex-col border-b border-secondary border-dashed">
      <button
        class={clx(
          "flex text-sm py-5 cursor-pointer justify-between items-center font-bold",
          textStyles[isOpen.value ? "open" : "closed"],
        )}
        onClick={() => isOpen.value = !isOpen.value}
      >
        <span>{title}</span>
        <Icon id={isOpen.value ? "minus" : "plus"} size={17} />
      </button>
      <div
        style={{ height: isOpen.value ? calculatedOpenHeight.value : "0px" }}
        class="overflow-hidden transition-all"
      >
        <p
          id={contentId}
          class="text-[#7E7F88] text-xs leading-[18px] pb-5"
          dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
      </div>
    </div>
  );
}
