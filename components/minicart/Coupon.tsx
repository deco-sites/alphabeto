import { MINICART_FORM_ID } from "../../constants.ts";
import { IconMinus } from "../Icons/IconMinus.tsx";
import Button, { ButtonType, TextStyles } from "../ui/Button.tsx";
import Input from "../ui/Input.tsx";
export interface Props {
  coupon?: string;
}
function Coupon({ coupon }: Props) {
  return (
    <div class="flex justify-between items-center flex-col mt-5">
      <div className="flex justify-between w-full items-center ">
        <span class="text-xs leading-[18px] font-bold text-[#676767]">
          Cupom de desconto
        </span>
        <button type="button" className="cursor-pointer">
          <IconMinus
            className="w-[18px] h-[18px]"
            strokeClassName="stroke-primary"
            strokeWidth={3}
          />
        </button>
      </div>
      <div className="flex gap-[5px] w-full pt-[10px]">
        <Input
          form={MINICART_FORM_ID}
          name="coupon"
          type="text"
          className="flex-1 h-11"
          value={coupon ?? ""}
          placeholder={"Digite o cupom"}
        />
        <Button
          className="min-w-[107px] h-11 min-h-11"
          styleType={ButtonType.Tertiary}
          textStyles={TextStyles.Small}
          form={MINICART_FORM_ID}
          name="action"
          value="set-coupon"
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
export default Coupon;
