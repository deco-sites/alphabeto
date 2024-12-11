import { useScriptAsDataURI } from "@deco/deco/hooks";
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

const loadDiscloujure = async (id: string, defaultOpen: boolean) => {
  const discloujure = document.getElementById(id);
  const button = discloujure?.querySelector("button");
  const content = discloujure?.querySelector("div");
  const svgUse = button?.querySelector("use");
  if (!button || !content || !svgUse) return;
  button.addEventListener("click", () => {
    const isOpen = content.style.height === "auto" ||
      content.style.height !== "0px";

    if (isOpen) {
      content.style.height = "0px";
      const newIcon = svgUse.getAttribute("href")?.replace("#minus", "#plus");
      svgUse?.setAttribute("href", newIcon ?? "");
      button.classList.remove("text-primary");
      button.classList.add("text-[#676767]");
    } else {
      content.style.height = `${content.scrollHeight}px`;
      const newIcon = svgUse.getAttribute("href")?.replace("#plus", "#minus");
      svgUse?.setAttribute("href", newIcon ?? "");
      button.classList.remove("text-[#676767]");
      button.classList.add("text-primary");
    }
  });

  if (defaultOpen) {
    content.style.height = `${content.scrollHeight}px`;
  }
};

export default function ProductTextInfoDiscloujure({
  title,
  content,
  defaultOpen,
}: Props) {
  const id = useId();
  if (!content) return null;
  return (
    <div class="flex flex-col border-b border-[#F7E0BF] border-dashed" id={id}>
      <button
        class={clx(
          "flex text-sm py-5 cursor-pointer justify-between items-center font-bold",
          textStyles[defaultOpen ? "open" : "closed"],
        )}
      >
        <span>{title}</span>
        <Icon id={defaultOpen ? "minus" : "plus"} size={17} />
      </button>
      <div
        style={{ height: defaultOpen ? "auto" : "0px" }}
        class="overflow-hidden transition-all"
      >
        <p
          class="text-[#7E7F88] text-xs leading-[18px] pb-5"
          dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
      </div>
      <script
        src={useScriptAsDataURI(loadDiscloujure, id, defaultOpen ?? false)}
      />
    </div>
  );
}
