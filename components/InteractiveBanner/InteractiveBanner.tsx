import { ImageWidget, RichText } from "apps/admin/widgets.ts";
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
  discountMessage: RichText;
  cupom: string;
  discountBackground: ImageWidget;
}

export default function InteractiveBanner({
  backgroundBannerImage,
  cupom,
  discountBackground,
  discountMessage,
  products,
}: InteractiveBannerProps) {
  return (
    <div className={"desk:px-10 mobile:px-5 mt-[100px]"}>
      {/* Banner principal com os produtos */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${backgroundBannerImage})` }}
      >
        {products?.map((item, index) => {
          if (!item.product) return null;

          const productImage =
            typeof item.previewImage?.src === "string"
              ? item.previewImage.src
              : item.product[0]?.image && typeof item.product[0]?.image === "string"
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
              <div className="flex absolute -top-[60px] left-[calc(100%+175px)] transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-md text-center w-full min-w-[385px] rounded-lg p-[10px]">
                {/* Imagem do Produto */}
                {productImage && (
                  <img
                    src={productImage}
                    alt={altText || "Produto"}
                    className="w-auto max-h-[123px] object-cover rounded-md mb-2"
                  />
                )}
                <div className={"flex flex-col"}>
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
                    href="#"
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
        className="w-full py-6 bg-cover bg-center flex flex-col items-center text-white rounded-b-lg"
        style={{ backgroundImage: `url(${discountBackground})` }}
      >
        <span className="text-lg font-medium mb-2" dangerouslySetInnerHTML={{ __html: discountMessage }} />
        <span className="text-center">
          <p className="text-sm">
            Use o cupom{" "}
            <strong className="font-bold">{cupom}</strong>{" "}
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
