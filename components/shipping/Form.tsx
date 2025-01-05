import type { SKU } from "apps/vtex/utils/types.ts";
import Button, { ButtonType } from "site/components/ui/Button.tsx";
import Input from "site/components/ui/Input.tsx";
import { useId } from "../../sdk/useId.ts";
import { useComponent } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

export default function Form({ items }: Props) {
  const slot = useId();

  return (
    <div class="flex flex-col mt-[30px]">
      <span class="text-accent text-xs leading-[14px] font-bold mb-1">
        Calcule seu frete
      </span>

      <form
        class="grid gap-1.5 grid-cols-[1fr_145px]"
        hx-target={`#${slot}`}
        hx-swap="innerHTML"
        hx-sync="this:replace"
        hx-post={useComponent(import.meta.resolve("./Results.tsx"), {
          items,
        })}
      >
        <Input
          as="input"
          type="text"
          placeholder="CEP"
          name="postalCode"
          maxLength={8}
          size={8}
        />
        <Button
          styleType={ButtonType.Secondary}
          type="submit"
        >
          <span class="[.htmx-request_&]:hidden inline">Calcular</span>
          <span class="[.htmx-request_&]:inline hidden loading loading-spinner loading-xs" />
        </Button>
      </form>

      <a
        class="text-accent text-xs leading-[14px] mt-2.5 underline"
        href="https://buscacepinter.correios.com.br/"
        target="__black"
      >
        Não sei meu CEP
      </a>

      {/* Results Slot */}
      <div id={slot} />
    </div>
  );
}
