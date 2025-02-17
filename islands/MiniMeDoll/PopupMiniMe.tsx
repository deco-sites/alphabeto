
import { useState } from "preact/hooks";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";
import { invoke } from "site/runtime.ts";
import {
  PlataformProps,
} from "site/components/product/ProductBuyTogether/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import generateImageMiniMe from "site/actions/minime/generateImageMiniMe.ts";
import { Signal } from "@preact/signals";
import { MiniMe, PartType } from "site/loaders/MiniMe/minime.ts";
import DollImage from "site/islands/components/DollImage.tsx";
import PopupDescription from "site/islands/components/popupComponents/PopupDescription.tsx";
import PopupTitle from "site/islands/components/popupComponents/PopupTitle.tsx";
import PopupActions from "site/islands/components/popupComponents/PopupActions.tsx";
import PopupImage from "site/islands/components/popupComponents/PopupImage.tsx";

interface Props {
  popupTitle: string;
  popupTerms: RichText;

  image: ImageWidget;
  dollParts: MiniMe;

  product: ProductDetailsPage | null;

  selectedParts: Signal<{ [key: string]: string }>;
  type: PartType;

  step: Signal<number>;

  handlePopup: Signal<boolean>
}

export default function PopupMiniMe(
  props: Props
) {

  const [IsChecked, setIsChecked] = useState(false);

  const handleCheck = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setIsChecked(target.checked);
  };

  return (
    <>
      <div class="fixed top-0 left-0 z-[100] bg-[#000] w-full h-full opacity-[25%]" />
      <section class="fixed z-[1000] top-[199px] left-[50%] mobile:top-[35px] -translate-x-1/2">
        <section class="relative flex mobile:flex-col w-[870px] mobile:w-[335px] bg-[#fff] rounded-[8px]">
          <Icon onClick={() => props.handlePopup.value = false} id="close" class="cursor-pointer text-[#FF8300] absolute right-0 m-[12px]" />
          <PopupImage {...props} step={props.step}/>

          <div class="flex flex-col ">
            <div class="p-[25px]">
              <PopupTitle popupTitle={props.popupTitle}/>
              <PopupDescription/>
              <span class="flex items-center">
                <input
                  type="checkbox"
                  class="mr-[8px] w-[16px] h-[16px] appearance-none border-2 border-[#FF8300] rounded-md checked:bg-[#FF8300] checked:border-[#FF8300] checked:text-white flex items-center justify-center"
                  checked={IsChecked}
                  onChange={handleCheck}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: props.popupTerms,
                  }}
                  class="font-Quicksand mobile:w-full mobile:max-w-[265px]"
                />
              </span>
              <PopupActions product={props.product}/>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
