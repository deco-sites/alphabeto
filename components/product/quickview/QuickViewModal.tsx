import { useScript } from "@deco/deco/hooks";
import { Product } from "apps/vtex/utils/types.ts";
import { ImageObject } from "apps/commerce/types.ts";
import { useId } from "site/sdk/useId.ts";

const script = (id: string, showButtonId: string) => {
  const togglebutton = document.getElementById(showButtonId);

  const toggleDrawer = () => {
    const drawer = document.getElementById(id);
    const delayedSection = document.getElementById("imagesModal");

    if (drawer?.classList.contains("translate-x-full")) {
      // Abre o modal
      drawer?.classList.remove("translate-x-full");
      drawer?.classList.add("translate-x-0");

      setTimeout(() => {
        delayedSection?.classList.remove("translate-x-full");
        delayedSection?.classList.remove("right-0");
        delayedSection?.classList.add("translate-x-0");
        delayedSection?.classList.add("right-[365px]");
      }, 300);
    } else {
      // Fecha o modal e reseta a seção atrasada
      drawer?.classList.remove("translate-x-0");
      drawer?.classList.add("translate-x-full");

      delayedSection?.classList.remove("translate-x-0");
      delayedSection?.classList.add("translate-x-full");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const drawer = document.getElementById(id);
    const delayedSection = document.getElementById("imagesModal");
    const togglebutton = document.getElementById(showButtonId);

    if (
      drawer &&
      delayedSection &&
      togglebutton &&
      !drawer.contains(event.target as Node) &&
      !delayedSection.contains(event.target as Node) &&
      event.target !== togglebutton
    ) {
      drawer?.classList.remove("translate-x-0");
      drawer?.classList.add("translate-x-full");

      delayedSection?.classList.remove("translate-x-0");
      delayedSection?.classList.add("translate-x-full");
      delayedSection?.classList.remove("right-[365px]");
      delayedSection?.classList.add("right-0");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  togglebutton?.addEventListener("click", toggleDrawer);
};

interface QuickViewModalProps {
  children: React.ReactNode;
  images: ImageObject[] | null | undefined;
}

function QuickViewModal({ children, images }: QuickViewModalProps) {
  const modalId = useId();
  const showButtonId = useId();
  console.log(images);

  return (
    <>
      <div class="text-center">
        <button
          class="bg-[#FF8300] hover:bg-[#F7E0BF] rounded-lg min-w-[300px] w-full font-bold text-white text-sm px-5 py-2.5 mb-2 lg:absolute "
          type="button"
          id={showButtonId}
        >
          quickview
        </button>
      </div>
      {/* Product Info */}
      <div
        id={modalId}
        class="fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-[375px] shadow-[0px_-4px_20px_0px_#3B3B3B26]"
      >
        <label class="modal-backdrop" for={modalId}>
          Close
        </label>
        {children}
      </div>
      {/* Product Images */}
      <div
        id="imagesModal"
        class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-[375px]"
      >
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(script, modalId, showButtonId),
        }}
      />
    </>
  );
}
export default QuickViewModal;
