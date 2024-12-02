import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import { useScript } from "@deco/deco/hooks";

interface InteractiveBannerProduct {
  previewImage: {
    src: ImageWidget;
    alt: string;
  };
  productId: number;
  xPosition: number;
  yPosition: number;
}

interface InteractiveBannerProps {
  backgroundBannerImage: ImageWidget;
  products: InteractiveBannerProduct[];
  discountMessage: RichText;
  cupom: string;
  discountBackground: ImageWidget;
}

const script = (id: number) => {
  const productCard = document.getElementById(`product-card-${id}`);

  const getProductData = async () => {
    const response = await fetch(
      `https://alphabeto.myvtex.com.br/api/catalog_system/pub/products/search/fq:${id}`,
    );
    console.log(response);
    return response.formData;
  };

  productCard?.addEventListener("click", getProductData);
};

export default function InteractiveBanner(
  {
    backgroundBannerImage,
    cupom,
    discountBackground,
    discountMessage,
    products,
  }: InteractiveBannerProps,
) {
  return (
    <div>
      <div style={{ backgroundImage: `url(${backgroundBannerImage})` }}>
        {products.map((product) => (
          <>
            <div
              id={`product-card-${product.productId}`}
              data-id={product.productId}
            >
              <img
                src={product.previewImage.src}
                alt={product.previewImage.alt}
                className="product-image"
              />
              <div className="product-details">
              </div>
            </div>
            <script
              type="module"
              dangerouslySetInnerHTML={{
                __html: useScript(script, product.productId),
              }}
            />
          </>
        ))}
      </div>
      <div style={{ backgroundImage: `url(${discountBackground})` }}>
        <span>
          {discountMessage}
        </span>

        <span>
          <p>
            Use o cupom
            <strong>
              {cupom}
            </strong>
            na sua sacola
          </p>
        </span>
      </div>
    </div>
  );
}
