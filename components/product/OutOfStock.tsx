import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "../../apps/site.ts";
import { useComponent } from "../../sections/Component.tsx";
import Input from "site/components/ui/Input.tsx";
import Button, { ButtonType } from "site/components/ui/Button.tsx";
import { useScript } from "@deco/deco/hooks";

export interface Props {
  productID: Product["productID"];
  state?: "idle" | "success" | "error";
}

export const action = async (props: Props, req: Request, ctx: AppContext) => {
  try {
    const form = await req.formData();

    const name = `${form.get("name") ?? ""}`;
    const email = `${form.get("email") ?? ""}`;

    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("vtex/actions/notifyme.ts", {
      skuId: props.productID,
      name,
      email,
    });

    return {
      ...props,
      state: "success",
    };
  } catch (_e: unknown) {
    return {
      ...props,
      state: "error",
    };
  }
};

export default function Notify({ productID, state = "idle" }: Props) {
  const stateMessages = {
    success: "Você será notificado assim que o produto estiver disponível!",
    error:
      "Ocorreu um erro ao tentar te notificar, tente novamente mais tarde.",
  };
  const message = stateMessages[state as keyof typeof stateMessages];
  return (
    <form
      class="form-control justify-start gap-2.5 mobile:max-w-[335px] mobile:mx-auto p-5 border border-[#F5F4F1] rounded-lg"
      hx-sync="this:replace"
      hx-indicator="this"
      hx-post={useComponent<Props>(import.meta.url, { productID })}
    >
      <span class="bg-secondary-content text-[#676767] text-lg leading-5 py-1 px-5 font-beccaPerry mobile:text-center">
        Este produto está indisponivel!
      </span>
      <span class="text-[#7E7F88] text-xs leading-[18px] max-w-[388px] mx-auto mb-2.5 text-center">
        Este produto não está disponível no momento, mas se você quiser podemos
        te avisar assim que voltar para os nossos estoques.
      </span>

      <Input placeholder="Nome" name="name" />
      <Input placeholder="E-mail" name="email" />

      <Button styleType={ButtonType.Secondary} class="border-primary">
        <span class="[.htmx-request_&]:hidden inline">Enviar</span>
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
      </Button>
      <button
        hx-on:click={useScript(() => {
          globalThis.scrollTo({
            top: document.getElementById("unavailable-shelf")?.offsetTop ?? 0,
            behavior: "smooth",
          });
        })}
        class="text-xs leading-5 text-[#676767] text-center font-bold"
      >
        veja produtos semelhantes
      </button>
      {message && (
        <span class="text-[#7E7F88] text-xs leading-[18px] max-w-[388px] mx-auto mb-2.5">
          {message}
        </span>
      )}
    </form>
  );
}
