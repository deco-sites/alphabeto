import { useScriptAsDataURI } from "@deco/deco/hooks";
import Icon from "site/components/ui/Icon.tsx";
import Modal from "site/components/ui/Modal.tsx";
import { SizeBaySettings } from "site/loaders/sizebay.ts";
import { useId } from "site/sdk/useId.ts";

export interface Props {
  sizebay: SizeBaySettings;
}

function handleSizebayManager(containersId: string) {
  window.addEventListener("message", (event) => {
    if (event.data === "close-fitting-room") {
      document.querySelectorAll<HTMLInputElement>(`#${containersId} input`)
        .forEach(
          (input) => {
            input.checked = false;
          },
        );
    }
  });
}

export default function ProductSizebay({ sizebay }: Props) {
  const vfrModalId = useId();
  const measurementChartModalId = useId();
  const containersId = useId();
  if (!sizebay) return null;

  return (
    <div
      id={containersId}
      class="flex gap-[30px] items-center mb-10 desk:mb-[30px]"
    >
      <div>
        <Modal
          id={vfrModalId}
          class="fixed bg-secondary-content rounded-lg top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4"
        >
          <iframe
            src={sizebay.virtualFittingRoom}
            class="w-full text-center max-w-[950px]"
            frameBorder="0"
            height={550}
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
          />
        </Modal>
        <label
          class="flex gap-1.5 items-center cursor-pointer text-xs leading-3 text-[#E56688] font-semibold"
          for={vfrModalId}
        >
          <Icon id="hanger" width="18px" height="14px" />
          Provador Virtual
        </label>
      </div>
      <div>
        <Modal
          id={measurementChartModalId}
          class="fixed bg-secondary-content rounded-lg top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4"
        >
          <iframe
            src={sizebay.measurementChart}
            class="w-full text-center max-w-[950px]"
            frameBorder="0"
            height={550}
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
          />
        </Modal>
        <label
          class="flex gap-1.5 items-center cursor-pointer text-xs leading-3 text-[#E56688] font-semibold"
          for={measurementChartModalId}
        >
          <Icon id="ruler" width="18px" height="20px" />
          Tabela de Medidas
        </label>
      </div>
      <script src={useScriptAsDataURI(handleSizebayManager, containersId)} />
    </div>
  );
}
