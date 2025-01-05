import { useSignal } from "@preact/signals";
import { Signal } from "@preact/signals-core";
import { IconMinus } from "site/components/Icons/IconMinus.tsx";
import { IconPlus } from "site/components/Icons/IconPlus.tsx";
import Button, { ButtonType, TextStyles } from "site/components/ui/Button.tsx";
import Input from "site/components/ui/Input.tsx";
import { MINICART_FORM_ID } from "site/constants.ts";
import { clx } from "site/sdk/clx.ts";
import { formatPrice } from "site/sdk/format.ts";

export interface Props {
  cep: string;
  shippingValue: number;
  openShipping: Signal<boolean>;
}
export default function Shipping({ cep, openShipping, shippingValue }: Props) {
  const hideInput = useSignal(cep.length > 0);
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const buttonSibling = target.nextElementSibling as HTMLButtonElement;
    const isEnter = event.key.toLowerCase() === "enter";
    if (isEnter) {
      event.preventDefault();
      event.stopPropagation();
      buttonSibling.click();
    } else {
      const mask = (value: string) =>
        value.replace(/\D/g, "").replace(/(\d{5})(\d{3})?/, "$1-$2");
      target.value = mask(target.value);
    }
  };

  return (
    <div class="flex justify-between items-center flex-col mt-5">
      <div class="flex justify-between w-full items-center ">
        <span class="text-xs leading-[18px] font-bold text-accent">
          CEP de Entrega
        </span>
        <button
          type="button"
          onClick={() => {
            openShipping.value = !openShipping.value;
          }}
        >
          {openShipping.value
            ? (
              <IconMinus
                class="w-[18px] h-[18px] toogle-minus-icon"
                strokeclass="stroke-primary"
                strokeWidth={3}
              />
            )
            : (
              <IconPlus
                class="w-[18px] h-[18px] toogle-minus-icon"
                strokeclass="stroke-primary"
                strokeWidth={3}
              />
            )}
        </button>
      </div>
      {hideInput.value
        ? (
          <div
            class={clx(
              "transition-[height] w-full overflow-hidden",
              openShipping.value ? "h-[60px]" : "h-0",
            )}
          >
            <div class="flex justify-between w-full pt-5">
              <span class="text-sm font-bold text-accent">Frete:</span>
              <div class="flex flex-col items-end text-accent">
                <span class="text-sm">
                  {cep}{" "}
                  <span class="font-bold">
                    | {formatPrice(shippingValue)}
                  </span>
                </span>
                <button
                  type="button"
                  class="text-xs underline text-[#e7e7e7e] pt-1"
                  onClick={() => {
                    hideInput.value = false;
                  }}
                >
                  Alterar CEP
                </button>
              </div>
            </div>
          </div>
        )
        : (
          <div
            class={clx(
              "transition-[height] w-full overflow-hidden",
              openShipping.value ? "h-[54px]" : "h-0",
            )}
          >
            <div class="flex gap-[5px] w-full pt-[10px]">
              <Input
                form={MINICART_FORM_ID}
                name="cep"
                type="text"
                class="flex-1 h-11"
                value={cep}
                placeholder={"Digite o CEP"}
                onKeyDown={onKeyDown}
              />
              <Button
                class="min-w-[107px] h-11 min-h-11"
                styleType={ButtonType.Tertiary}
                textStyles={TextStyles.Small}
                form={MINICART_FORM_ID}
                name="action"
                value="set-shipping"
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
