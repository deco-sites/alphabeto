import { Signal } from "@preact/signals-core";
import { IconMinus } from "site/components/Icons/IconMinus.tsx";
import { IconPlus } from "site/components/Icons/IconPlus.tsx";
import Button, { ButtonType, TextStyles } from "site/components/ui/Button.tsx";
import Input from "site/components/ui/Input.tsx";
import { MINICART_FORM_ID } from "site/constants.ts";
import { clx } from "site/sdk/clx.ts";
export interface Props {
  openCoupon: Signal<boolean>;
  coupon?: string;
}
export default function Coupon({ coupon, openCoupon }: Props) {
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
        <span class="text-xs leading-[18px] font-bold text-[#676767]">Cupom de desconto</span>
        <button
          type="button"
          onClick={() => {
            openCoupon.value = !openCoupon.value;
          }}
        >
          {openCoupon.value ? <IconMinus className="w-[18px] h-[18px] toogle-minus-icon" strokeClassName="stroke-primary" strokeWidth={3} /> : <IconPlus className="w-[18px] h-[18px] toogle-minus-icon" strokeClassName="stroke-primary" strokeWidth={3} />}
        </button>
      </div>
      {coupon ? (
        <div className={clx("transition-[height] w-full overflow-hidden", openCoupon.value ? "h-[60px]" : "h-0")}>
          <div className="flex justify-between w-full pt-5">
            <span className="text-sm font-bold text-[#676767]">Cupom:</span>
            <div className="flex flex-col items-end text-[#676767]">
              <span className="text-sm">{coupon}</span>
              <input type="hidden" form={MINICART_FORM_ID} className="hidden" name="coupon" value="" />
              <button form={MINICART_FORM_ID} className="text-xs underline text-[#e7e7e7e] pt-1" name="action" value="set-coupon">
                Remover
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={clx("transition-[height] w-full overflow-hidden", openCoupon.value ? "h-[54px]" : "h-0")}>
          <div className="flex gap-[5px] w-full pt-[10px]">
            <Input form={MINICART_FORM_ID} name="coupon" type="text" className="flex-1 h-11" value={coupon ?? ""} placeholder={"Digite o cupom"} onKeyDown={onKeyDown} />
            <Button className="min-w-[107px] h-11 min-h-11" styleType={ButtonType.Tertiary} textStyles={TextStyles.Small} form={MINICART_FORM_ID} name="action" value="set-coupon">
              Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
