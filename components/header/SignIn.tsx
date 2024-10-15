import { useScript } from "@deco/deco/hooks";
import { useId } from "../../sdk/useId.ts";
import { IconUser } from "../Icons/IconUser.tsx";

const onLoad = (containerID: string) => {
  window.STOREFRONT.USER.subscribe((sdk) => {
    const container = document.getElementById(containerID) as HTMLDivElement;
    const nodes = container.querySelectorAll<HTMLAnchorElement>("a");
    const login = nodes.item(0);
    const account = nodes.item(1);
    const user = sdk.getUser();
    if (user?.email) {
      login.classList.add("hidden");
      account.classList.remove("hidden");
    } else {
      login.classList.remove("hidden");
      account.classList.add("hidden");
    }
  });
};

export function SignInDesktop() {
  const id = useId();
  return (
    <div id={id}>
      <a href="/login" aria-label="Login">
        <IconUser />
      </a>
      <a class="hidden btn btn-sm font-thin btn-ghost no-animation" href="/account" aria-label="Account">
        <IconUser />
      </a>
      <script type="module" dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }} />
    </div>
  );
}
export function SignInMobile() {
  const id = useId();
  return (
    <div id={id} className="pt-5 pb-[30px] border-b-secondary border-dashed border-b">
      <a href="/login" aria-label="Login">
        <div className="flex gap-[10px] items-center">
          <div className="bg-secondary rounded-full w-[30px] h-[30px] flex items-center justify-center">
            <IconUser className="w-[18px] h-[18px]" />
          </div>
          <p className="text-xs leading-[18px] font-bold text-base-300">
            Olá!, Faça seu <span className="text-primary underline">Login</span> ou <span className="text-primary underline">Cadastre-se</span>
          </p>
        </div>
      </a>
      <a href="/account" aria-label="Account" className="hidden">
        <div className="flex gap-[10px] items-center">
          <div className="bg-secondary rounded-full w-[30px] h-[30px] flex items-center justify-center">
            <IconUser className="w-[18px] h-[18px]" />
          </div>
          <p className="text-xs leading-[18px] font-bold text-base-300">
            Olá!, Ir para <span className="text-primary underline">Minha Conta</span>
          </p>
        </div>
      </a>
      <script type="module" dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }} />
    </div>
  );
}
