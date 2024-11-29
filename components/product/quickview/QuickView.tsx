import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import { JSX } from "preact";
import { useId } from "site/sdk/useId.ts";
import { useVariantPossibilities } from "site/sdk/useVariantPossiblities.ts";

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

const script = (id: string, showButtonId: string, imagesModalId: string) => {
  const togglebutton = document.getElementById(showButtonId);
  const closeDrawerbutton = document.getElementById("closeModalId")
  const drawer = document.getElementById(id);
  const delayedSection = document.getElementById(imagesModalId);

  const toggleDrawer = () => {
    if (drawer?.classList.contains("translate-x-full")) {
      drawer?.classList.remove("translate-x-full");
      drawer?.classList.add("translate-x-0");

      setTimeout(() => {
        delayedSection?.classList.remove("translate-x-full");
        delayedSection?.classList.remove("right-0");
        delayedSection?.classList.add("translate-x-0");
        delayedSection?.classList.add("right-[375px]");
      }, 300);
    } else {
      drawer?.classList.remove("translate-x-0");
      drawer?.classList.add("translate-x-full");

      delayedSection?.classList.remove("translate-x-0");
      delayedSection?.classList.add("translate-x-full");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
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
      delayedSection?.classList.remove("right-[375px]");
      delayedSection?.classList.add("right-0");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  togglebutton?.addEventListener("click", toggleDrawer);

  closeDrawerbutton?.addEventListener("click", () => {
    drawer?.classList.remove("translate-x-0");
    drawer?.classList.add("translate-x-full");

    delayedSection?.classList.remove("translate-x-0");
    delayedSection?.classList.add("translate-x-full");
    delayedSection?.classList.remove("right-[375px]");
    delayedSection?.classList.add("right-0");
  })
};

function QuickView({ product }: Props) {
  const modalId = useId();
  const showButtonId = useId();
  const imagesModalId = useId();

  const hasVariant = product.isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});

  const getColorStyle = (colorName: string) => {
    const colorsMap: Record<string, string> = {
      ROSA: "#FFC0CB",
      VERDE: "#008000",
      CORAL: "#FF7F50",
      AZUL: "#0000FF"
    };
    return colorsMap[colorName.toUpperCase()] || null;
  };  

  return (
    <>
      <div className="text-center">
        <button
          className="bg-[#FF8300] hover:bg-[#F7E0BF] rounded-lg min-w-[300px] w-full font-bold text-white text-sm px-5 py-2.5 mb-2 lg:absolute"
          type="button"
          id={showButtonId}
        >
          quickview
        </button>
      </div>
      {/* Product Info */}
      <div
        id={modalId}
        className="fixed top-0 right-0 z-50 h-screen overflow-y-auto transition-transform translate-x-full bg-white w-[375px] shadow-[0px_-4px_20px_0px_#3B3B3B26]"
      >
        <div className={"w-full flex items-center justify-between px-6 py-4 bg-[#FDF6ED] border-b border-[#FF8300] border-dashed"}>
          <p className="text-[#FF8300] font-bold leading-6 ">Selecione as opções</p>
          <label id={"closeModalId"} className="text-[#FF8300] font-bold leading-6 " htmlFor={modalId}>
            X
          </label>
        </div>
        <div>
          <p className={"text-[20px] font-bold leading-6 text-[#676767]"}>{product.name}</p>
          <div>
            <p><strong>{product.offers?.highPrice}</strong> - {product.offers?.lowPrice}</p>
          </div>
          <p className={"text-xs font-medium leading-[18px] text-[##7E7F88]"}>{product.description}</p>
          {product?.additionalProperty
            ?.filter(
              (property) =>
                property.name === "Tamanho",
            )
            .map((property, index) => (
              <div key={index}>
                <p>{property.name}: {property.value}</p>
              </div>
            ))}

          {variants.map(([colorName, url], index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none"
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: getColorStyle(colorName),
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                title={colorName}
              />
            </a>
          ))}
        </div>
      </div>
      {/* Product Images */}
      <div
        id={imagesModalId}
        style={{ scrollbarWidth: "none" }}
        className="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-[375px] flex flex-col gap-[10px]"
      >
        {product.image?.map((image, index) => (
          <div key={index} className="">
            <img
              src={image.url}
              alt={image.alternateName || "Image"}
              title={image.name || "Image"}
              className="rounded-md max-w-[327px]"
            />
          </div>
        ))}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(script, modalId, showButtonId, imagesModalId)
        }}
      />
    </>
  );
}

export default QuickView;
