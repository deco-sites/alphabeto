import { Signal } from "@preact/signals-core";
import { IconMinus } from "site/components/Icons/IconMinus.tsx";
import { IconPlus } from "site/components/Icons/IconPlus.tsx";
import Button, { ButtonType, TextStyles } from "site/components/ui/Button.tsx";
import Input from "site/components/ui/Input.tsx";
import { MINICART_FORM_ID } from "site/constants.ts";
import { clx } from "site/sdk/clx.ts";

interface Props {
  openSeller: Signal<boolean>;
  sellerCode?: string;
}

export default function Seller(props: Props) {
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;
    const buttonSibling = target.nextElementSibling as HTMLButtonElement;
    const isEnter = event.key.toLowerCase() === "enter";
    if (isEnter) {
      event.preventDefault();
      event.stopPropagation();
      buttonSibling.click();
    }
  };
  return (
    <div class="flex justify-between items-center flex-col mt-5">
      <div className="flex justify-between w-full items-center ">
        <span class="text-xs leading-[18px] font-bold text-[#676767]">Código vendedor (a)</span>
        <button
          type="button"
          onClick={() => {
            props.openSeller.value = !props.openSeller.value;
          }}
        >
          {props.openSeller.value ? <IconMinus className="w-[18px] h-[18px] toogle-minus-icon" strokeClassName="stroke-primary" strokeWidth={3} /> : <IconPlus className="w-[18px] h-[18px] toogle-minus-icon" strokeClassName="stroke-primary" strokeWidth={3} />}
        </button>
      </div>
      <div className={clx("transition-[height] w-full overflow-hidden", props.openSeller.value ? "h-[54px]" : "h-0")}>
        <div className={clx("flex gap-[5px] w-full pt-[10px]")}>
          <Input form={MINICART_FORM_ID} name="sellerCode" type="text" className="flex-1 h-11" value={props.sellerCode} placeholder={"Digite o código"} onKeyDown={onKeyDown} />
          <Button className="min-w-[107px] h-11 min-h-11" styleType={ButtonType.Tertiary} textStyles={TextStyles.Small} form={MINICART_FORM_ID} name="action" value="set-seller-code">
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
