import { type ComponentChildren } from "preact";
import { clx } from "../../../sdk/clx.ts";
import { useId } from "../../../sdk/useId.ts";
import { IconCloseDrawer } from "../../Icons/IconCloseDrawer.tsx";
export interface Props {
  open?: boolean;
  class?: string;
  children?: ComponentChildren;
  aside: ComponentChildren;
  id?: string;
}

function DrawerForIslands({ children, aside, open, class: _class = "", id = useId() }: Props) {
  return (
    <>
      <div class={clx("drawer", _class)}>
        <input id={id} name={id} checked={open} type="checkbox" class="drawer-toggle" aria-label={open ? "open drawer" : "closed drawer"} />

        <div class="drawer-content">{children}</div>

        <aside data-aside class={clx("drawer-side h-full z-40 overflow-hidden", "[[data-aside]&_section]:contents")}>
          <label for={id} class="drawer-overlay" />
          {aside}
        </aside>
      </div>
    </>
  );
}
function Aside({ title, drawer, children, class: _class = "" }: { title: string; drawer: string; children: ComponentChildren; maxWidth?: string; class?: string }) {
  return (
    <div data-aside class={clx("bg-secondary-content grid grid-rows-[auto_1fr] h-full divide-y mobile:w-full", _class)}>
      <div class="flex justify-between items-center px-6 h-[50px] border-b-[1px] border-primary border-dashed">
        <h3>
          <span class="font-bold text-sm text-primary">{title}</span>
        </h3>
        <label for={drawer} aria-label="X" class="py-1 pl-1 cursor-pointer">
          <IconCloseDrawer />
        </label>
      </div>
      {children}
    </div>
  );
}
DrawerForIslands.Aside = Aside;
export default DrawerForIslands;
