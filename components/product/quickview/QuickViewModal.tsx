import { useScript } from "@deco/deco/hooks";
import { ComponentChildren } from "preact";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";
interface Props {
  open?: boolean;
  children?: ComponentChildren;
  id?: string;
  className?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.checked = false;
  };
  addEventListener("keydown", handler);
};
function QuickViewModal({ children, open, id = useId(), className }: Props) {
  return (
    <>
      <input id={id} checked={open} type="checkbox" class="modal-toggle" />
      <div
        class={clx("modal", className)}
      >
        {children}
        <label class="modal-backdrop" for={id}>
          Close
        </label>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}
export default QuickViewModal;
