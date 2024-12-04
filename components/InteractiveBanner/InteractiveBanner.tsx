import { ImageWidget } from "apps/admin/widgets.ts";
import { Product } from "apps/commerce/types.ts";
import { LoadingFallbackProps } from "@deco/deco";

interface InteractiveBannerProduct {
  previewImage?: {
    src?: ImageWidget;
    alt?: string;
  };
  xPosition: number;
  yPosition: number;
  product: Product[] | null;
}

interface InteractiveBannerProps {
  backgroundBannerImage: ImageWidget;
  products: InteractiveBannerProduct[];
  discountValue: number;
  cupom: string;
  discountBackground: ImageWidget;
}

export default function InteractiveBanner({
  backgroundBannerImage,
  cupom,
  discountBackground,
  discountValue,
  products,
}: InteractiveBannerProps) {
  return (
    <div className={"desk:px-10 mobile:px-5 mt-[100px] container py-5 sm:py-10"}>
      {/* Banner principal com os produtos */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${backgroundBannerImage})` }}
      >
        {products?.map((item, index) => {
          if (!item.product) return null;

          const productImage = typeof item.previewImage?.src === "string"
            ? item.previewImage.src
            : item.product[0]?.image &&
              typeof item.product[0]?.image === "string"
              ? item.product[0].image
              : undefined;

          const altText = item.previewImage?.alt || item.product[0]?.name;
          const offers = item.product[0]?.offers;

          return (
            <div
              key={index}
              className="absolute group"
              style={{
                left: `${item.xPosition}%`,
                top: `${item.yPosition}%`,
                transform: "translate(-50%, -50%)", // Centraliza os círculos
              }}
            >
              {/* Círculo com bolinha branca */}
              <div className="relative w-11 h-11 bg-transparent rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <div className="absolute w-11 h-11 bg-white opacity-50 rounded-full" />
                <div className="relative w-6 h-6 shadow-lg bg-white rounded-full" />
              </div>

              {/* Informações do produto ao hover */}
              <div className="flex absolute -top-[50px] left-[calc(100%+215px)] transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-md text-center w-full min-w-[385px] rounded-lg p-[10px] gap-3">
                {/* Imagem do Produto */}
                {productImage && (
                  <img
                    src={productImage}
                    alt={altText || "Produto"}
                    className="w-auto max-h-[123px] object-cover rounded-md mb-2"
                  />
                )}
                <div className={"flex flex-col items-start"}>
                  <h3 className="text-[#676767] max-w-[264px] w-full leading-[18px] font-bold text-xs">
                    {item.product[0]?.name || "Nome indisponível"}
                  </h3>

                  <div className="mt-3 flex items-center">
                    {offers?.highPrice && (
                      <p className="text-[#C5C5C5] text-xs line-through font-semibold mr-[5px]">
                        R$ {offers.highPrice.toFixed(2)}
                      </p>
                    )}
                    {offers?.lowPrice && (
                      <p className="text-[#FF8300] font-semibold text-sm">
                        • R$ {offers.lowPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <a
                    href={item.product[0].url}
                    className="text-[#FF8300] font-bold lowercase text-xs mt-4 inline-block underline"
                  >
                    ver produto
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner de desconto */}
      <div
        className="w-full py-5 bg-cover bg-center items-center text-white rounded-b-lg flex justify-center"
        style={{ backgroundImage: `url(${discountBackground})` }}
      >
        <span className="text-[40px] font-medium mb-2 font-['BeccaPerry'] text-[#FFF5FD] w-2/5 flex items-center leading-8 ">
          <strong
            style={{
              WebkitTextStrokeColor: "#FF8300",
              WebkitTextStrokeWidth: "1px",
            }}
            className={"text-[80px] font-medium"}
          >
            {discountValue}%
          </strong>

          <span className={"text-[80px] text-[#FF8300] font-medium mr-[33px]"}>
            OFF{" "}
          </span>
          na sua primeira compra
        </span>
        <span className="text-center">
          <p className="flex flex-col text-[#FFF5FD] text-base font-bold leading-5 text-center">
            Use o cupom
            <strong className="border-[#D6DE23] border-2 border-dashed text-[#D6DE23] text-3xl leading-9 bg-[#FF8300] rounded-lg px-[10px] py-[5px]">{cupom}</strong>{" "}
            na sua sacola
          </p>
        </span>
      </div>
    </div>
  );
}

export const LoadingFallback = (
  props: LoadingFallbackProps<InteractiveBannerProps>,
) => (
  // deno-lint-ignore no-explicit-any
  <InteractiveBanner {...(props as any)} loading="lazy" />
);
