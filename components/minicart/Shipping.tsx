import { MINICART_FORM_ID } from "../../constants.ts";
import { IconMinus } from "../Icons/IconMinus.tsx";
import Button, { ButtonType, TextStyles } from "../ui/Button.tsx";
import Input from "../ui/Input.tsx";

export interface Props {
  cep: string;
}
export default function Shipping({ cep }: Props) {
  return (
    <div class="flex justify-between items-center flex-col mt-5 mb-5">
      <div className="flex justify-between w-full items-center ">
        <span class="text-xs leading-[18px] font-bold text-[#676767]">
          CEP de entrega
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
          name="cep"
          type="text"
          className="flex-1 h-11"
          value={cep ?? ""}
          placeholder={"Digite o CEP"}
        />
        <Button
          className="min-w-[107px] h-11 min-h-11"
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
  );
}
