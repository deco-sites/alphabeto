import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
import { JSX } from "preact";
import { useId } from "site/sdk/useId.ts";
import { useVariantPossibilities } from "site/sdk/useVariantPossiblities.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import AddToCartButton from "site/components/product/AddToCartButton.tsx";

export interface ColorItem {
  name: string;
  hexadecimals: string[];
}

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
}

const script = (id: string, showButtonId: string, imagesModalId: string) => {
  const togglebutton = document.getElementById(showButtonId);
  const closeDrawerbutton = document.getElementById("closeModalId");
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
  });
};

function QuickView({ product, seller, item }: Props) {
  const modalId = useId();
  const showButtonId = useId();
  const imagesModalId = useId();

  const hasVariant = product.isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});

  const { listPrice, price, installments } = useOffer(product.offers);

  return (
    <>
      <div className="text-center flex justify-center">
        <button
          id={showButtonId}
          className="desk:hidden desk:group-hover:block mobile:block desk:absolute w-full bg-[#FF8300] hover:bg-[#F7E0BF] rounded-lg px-5 py-2.5 text-white font-bold text-sm transition desk:top-[415px] desk:w-[calc(100%-20px)] right-[10px  ] hover:text-[#FF8300]"
          type="button"
        >
          quickview
        </button>
      </div>
      {/* Product Info */}
      <div
        id={modalId}
        className="fixed top-0 right-0 z-50 h-screen overflow-y-auto transition-transform translate-x-full bg-white w-[375px]"
      >
        <div
          className={"w-full flex items-center justify-between px-6 py-4 bg-[#FDF6ED] border-b border-[#FF8300] border-dashed"}
        >
          <p className="text-[#FF8300] font-bold leading-6 ">
            Selecione as opções
          </p>
          <label
            id={"closeModalId"}
            className="text-[#FF8300] font-bold leading-6 "
            htmlFor={modalId}
          >
            X
          </label>
        </div>
        <div className={"py-10 px-6"}>
          <p
            className={"p-[5px] rounded-lg bg-[#F7E0BF] text-[#FF8300] text-xs font-bold leading-[18px] mb-5 max-w-fit"}
          >
            crianças de 1 à 10 anos
          </p>
          <p className={"text-[20px] font-bold leading-6 text-[#676767]"}>
            {product.name}
          </p>
          <div className={"mt-3"}>
            <p className="text-[#676767] text-xs leading-[14px font-medium]">
              REF: {product.sku}
            </p>
          </div>
          <div className={"my-[30px]"}>
            <p className={"text-[#C5C5C5] text-sm leading-5 font-bold"}>
              {listPrice}
              <strong
                className={"font-bold ml-[5px] text-lg text-[#FF8300] leading-6"}
              >
                • {price}
              </strong>
            </p>
            <p
              className={"text-[#676767] font-medium text-xs mt-[5px] leading-[18px]"}
            >
              {installments}
            </p>
            <div className="relative inline-block mt-3">
              {/* Triângulo */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#D6DE23]" />
              {/* Botão */}
              <span className="flex relative z-10 bg-[#D6DE23] text-[#FF8300] font-bold p-[5px] rounded-lg text-xs transition">
                <img
                  src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/alphabeto/765ee7fe-12a3-4a7e-b7e1-4d17c13f48b8/Accounting-Coins--Streamline-Ultimate.svg.svg"
                  alt="Ícone de moeda"
                  className={"mr-[3px]"}
                />
                Ganhe 15% de cashback
              </span>
            </div>
          </div>
          <p
            className={"text-xs font-medium leading-[18px] text-[#7E7F88] line-clamp-3"}
          >
            {product.description}
          </p>
          <a
            href={product?.url}
            className="text-[#FF8300] font-bold underline relative text-xs -top-5 left-64 bg-white p-1"
          >
            Veja mais
          </a>

          <div>
            {product?.additionalProperty
              ?.filter((property) => property.name === "Cor")
              .map((property, index) => (
                <p
                  className={"text-[#7E7F88] text-xs font-bold leading-[14px] "}
                  key={index}
                >
                  Selecione a cor:{" "}
                  <strong className={"font-normal"}>{property.value}</strong>
                </p>
              ))}

            {
              /* {variants.map(([colorName, url], index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  title={colorName}
                />
              </a>
            ))} */
            }
          </div>

          <div>
            {product?.additionalProperty
              ?.filter((property) => property.name === "Tamanho")
              .map((property, index) => (
                <p
                  className={"text-[#7E7F88] text-xs font-bold leading-[14px] "}
                  key={index}
                >
                  Selecione o tamanho:{" "}
                  <strong className={"font-normal"}>{property.value}</strong>
                </p>
              ))}
          </div>

          <AddToCartButton product={product} seller={seller} item={item} />
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
              className="rounded-md w-full"
            />
          </div>
        ))}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(script, modalId, showButtonId, imagesModalId),
        }}
      />
    </>
  );
}

export default QuickView;
