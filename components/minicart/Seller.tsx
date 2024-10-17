import { MINICART_FORM_ID } from "../../constants.ts";
import { IconMinus } from "../Icons/IconMinus.tsx";
import Button, { ButtonType, TextStyles } from "../ui/Button.tsx";
import Input from "../ui/Input.tsx";

export default function Seller() {
  return (
    <div class="flex justify-between items-center flex-col mt-5">
      <div className="flex justify-between w-full items-center ">
        <span class="text-xs leading-[18px] font-bold text-[#676767]">Código do Vendedor:</span>
        <div>
          <IconMinus className="w-[18px] h-[18px] toogle-minus-icon" strokeClassName="stroke-primary" strokeWidth={3} />
        </div>
      </div>
      <div className="flex gap-[5px] w-full pt-[10px] toogledArea">
        <Input form={MINICART_FORM_ID} name="sellerCode" type="text" className="flex-1 h-11" value={""} placeholder={"Digite o código"} />
        <Button className="min-w-[107px] h-11 min-h-11" styleType={ButtonType.Tertiary} textStyles={TextStyles.Small} form={MINICART_FORM_ID} name="action" value="set-seller-code">
          Adicionar
        </Button>
      </div>
    </div>
  );
}
