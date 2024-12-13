/*
 * The BUY_TOGETHER is a responsible for change product when the size or color is changed, update the price and information for the product resume, and add products to cart.
 */

import { Product } from "apps/commerce/types.ts";
import { formatPrice } from "site/sdk/format.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { uppercaseFirstLetter } from "site/sdk/stringUtils.ts";
import { getSrcSet } from "apps/website/components/Image.tsx";
interface BuyTogetherProduct {
  productId: string;
  skuId: string;
  name: string;
  image: string;
  imageSrcSet: ReturnType<typeof getSrcSet>;
  resumeProductImageSet: ReturnType<typeof getSrcSet>;
  price: number;
  percent: number;
  listPrice: number;
  installments: string;
  formatedPrice: string;
  formatedListPrice: string;
  color: string;
  size: string;
  formatedColor: string;
}

interface BuyTogetherSDKTagProps {
  product: Product;
}
export const BuyTogetherSDKTag = (props: BuyTogetherSDKTagProps) => {
  const buyTogetherProducts = convertProductToBuyTogetherProduct(props.product);
  return (
    <input
      class="hidden"
      type="text"
      id="product-data"
      value={JSON.stringify(buyTogetherProducts)}
    />
  );
};
export const convertProductToBuyTogetherProduct = (
  product: Product
): BuyTogetherProduct[] => {
  const result = product.isVariantOf?.hasVariant
    .filter(
      (variant) =>
        variant.offers?.offers[0].availability === "https://schema.org/InStock"
    )
    .map((variant) => {
      const {
        offers,
        image: images,
        name = "",
        productID: skuId,
        inProductGroupWithID: productId = "",
      } = variant;
      const { listPrice = 0, price = 0, installments } = useOffer(offers);
      const image = images?.[0].url ?? "";
      const color =
        variant.additionalProperty?.find((property) => property.name === "Cor")
          ?.value ?? "";
      const size =
        variant.additionalProperty?.find(
          (property) => property.name === "Tamanho"
        )?.value ?? "";
      const percent =
        listPrice && price
          ? Math.round(((listPrice - price) / listPrice) * 100)
          : 0;
      const buyTogetherProduct: BuyTogetherProduct = {
        productId,
        skuId,
        name,
        image,
        imageSrcSet: getSrcSet(image, 328, 466),
        resumeProductImageSet: getSrcSet(image, 90, 134),
        price,
        color,
        size,
        percent,
        listPrice,
        installments: installments ?? "",
        formatedPrice: formatPrice(price) ?? "",
        formatedListPrice: formatPrice(listPrice) ?? "",
        formatedColor: uppercaseFirstLetter(color.toLowerCase()),
      };
      return buyTogetherProduct;
    });

  return result ?? [];
};

interface BuyTogether {
  products: BuyTogetherProduct[];
  toogleProduct: (productId: string) => void;
  changeSelector: (productId: string) => void;
  updateProductResume: () => void;
  addProductsToCart: () => void;
}

declare global {
  interface Window {
    BUY_TOGETHER?: BuyTogether;
  }
}
export const createAndLoadSDK = (minicartDrawerId: string) => {
  window.BUY_TOGETHER = {
    products: [],
    toogleProduct: (productId: string) => {
      const card = document.querySelector<HTMLDivElement>(
        `#buy-together div[data-product-id="${productId}"]`
      );
      if (!card) return;
      const productCheckbox = card.querySelector<HTMLInputElement>(
        `input#product-checkbox`
      );
      const productImg =
        card.querySelector<HTMLImageElement>(`img#product-image`);
      const toogleButton = card.querySelector<HTMLButtonElement>(
        `button#toogle-product`
      );
      if (!productImg || !toogleButton || !productCheckbox) return;
      const currentProductEnabled = productCheckbox.checked;
      if (currentProductEnabled) {
        productCheckbox.checked = false;
        toogleButton.classList.add("rotate-45");
        productImg.classList.add("opacity-50");
      } else {
        productCheckbox.checked = true;
        toogleButton.classList.remove("rotate-45");
        productImg.classList.remove("opacity-50");
      }
      window.BUY_TOGETHER?.updateProductResume();
    },
    changeSelector: (productId: string) => {
      const changedElement = event?.target as HTMLSelectElement;
      const card = document.querySelector<HTMLDivElement>(
        `#buy-together div[data-product-id="${productId}"]`
      );
      const colorSelector =
        card?.querySelector<HTMLSelectElement>("select#color");
      const sizeSelector =
        card?.querySelector<HTMLSelectElement>("select#size");
      const productDataElement =
        card?.querySelector<HTMLInputElement>("input#product-data");
      const imageElement =
        card?.querySelector<HTMLImageElement>("img#product-image");
      const priceElement = card?.querySelector<HTMLParagraphElement>("p#price");
      const listPriceContainer =
        card?.querySelector<HTMLDivElement>("div#listPriceArea");
      const listPriceElement =
        card?.querySelector<HTMLParagraphElement>("p#listPrice");
      const installmentsElement =
        card?.querySelector<HTMLParagraphElement>("p#installments");
      const discountAreaElement =
        card?.querySelector<HTMLDivElement>("div#discountArea");
      const discountElement =
        card?.querySelector<HTMLParagraphElement>("p#discountPercent");
      if (
        !card ||
        !colorSelector ||
        !sizeSelector ||
        !productDataElement ||
        !imageElement ||
        !priceElement ||
        !listPriceContainer ||
        !listPriceElement ||
        !installmentsElement ||
        !discountAreaElement ||
        !discountElement ||
        !changedElement
      )
        return;
      const changedItemName = changedElement.name;
      const productData = JSON.parse(
        productDataElement.value
      ) as BuyTogetherProduct[];
      const selectedColor = colorSelector.value;
      const selectedSize = sizeSelector.value;
      const finedProduct = productData.find(
        (p) => p.color === selectedColor && p.size === selectedSize
      );
      const updateProduct = (newProduct: BuyTogetherProduct) => {
        const { listPrice, price } = newProduct;
        imageElement.setAttribute("srcset", newProduct.imageSrcSet ?? "");
        imageElement.src = newProduct.image;
        if (newProduct.percent > 0) {
          discountElement.textContent = `-${newProduct.percent}% off`;
          discountAreaElement.classList.remove("hidden");
        } else {
          discountElement.classList.add("hidden");
        }
        if (listPrice > price) {
          listPriceContainer.classList.remove("hidden");
          listPriceElement.textContent = newProduct.formatedListPrice;
        } else {
          listPriceContainer.classList.add("hidden");
        }
        priceElement.textContent = newProduct.formatedPrice;
        if (newProduct.installments) {
          installmentsElement.textContent = `Em até ${newProduct.installments}`;
          installmentsElement.classList.remove("hidden");
        } else {
          installmentsElement.classList.add("hidden");
        }
      };
      if (finedProduct) {
        updateProduct(finedProduct);
      } else {
        alert("Produto com essa cor e tamanho não encontrado.");
        let findFirstSameItem = productData.find(
          (p) => p[changedItemName as keyof typeof p] === changedElement.value
        );
        if (!findFirstSameItem) findFirstSameItem = productData[0];
        updateProduct(findFirstSameItem);
        colorSelector.value = findFirstSameItem.color;
        sizeSelector.value = findFirstSameItem.size;
        const colorSelectorSpan =
          colorSelector.nextElementSibling?.querySelector("span");
        if (colorSelectorSpan)
          colorSelectorSpan.textContent = findFirstSameItem.formatedColor;
        const sizeSelectorSpan =
          sizeSelector.nextElementSibling?.querySelector("span");
        if (sizeSelectorSpan)
          sizeSelectorSpan.textContent = findFirstSameItem.size;
      }
      window.BUY_TOGETHER?.updateProductResume();
    },
    updateProductResume: () => {
      const allProductCards = document.querySelectorAll<HTMLInputElement>(
        "#buy-together div[data-product-id]"
      );
      interface ResumedData {
        total: number;
        images: {
          src: string;
          srcSet: string | undefined;
        }[];
      }
      const resumedData = Array.from(allProductCards).reduce<ResumedData>(
        (acc, card) => {
          const isActive = card.querySelector<HTMLInputElement>(
            "input#product-checkbox"
          )?.checked;
          if (!isActive) return acc;
          const productData = JSON.parse(
            card.querySelector<HTMLInputElement>("input#product-data")?.value ??
              "[]"
          ) as BuyTogetherProduct[];
          const selectedColor =
            card.querySelector<HTMLSelectElement>("select#color")?.value ?? "";
          const selectedSize =
            card.querySelector<HTMLSelectElement>("select#size")?.value ?? "";
          const finedProduct = productData.find(
            (p) => p.color === selectedColor && p.size === selectedSize
          );
          if (!finedProduct) return acc;
          const { price, image, resumeProductImageSet } = finedProduct;
          return {
            total: acc.total + price,
            images: [
              ...acc.images,
              { src: image, srcSet: resumeProductImageSet },
            ],
          };
        },
        {
          total: 0,
          images: [],
        }
      );
      const resumeCard = document.querySelector<HTMLDivElement>(
        "#buy-together div#product-resume"
      );
      const textElement =
        resumeCard?.querySelector<HTMLParagraphElement>("#text");
      const priceElement =
        resumeCard?.querySelector<HTMLParagraphElement>("#price");
      const principalProductImage = resumeCard?.querySelector<HTMLImageElement>(
        "#principal-product-image"
      );
      const sugestionOneImage = resumeCard?.querySelector<HTMLImageElement>(
        "#sugestion-one-image"
      );
      const sugestionTwoImage = resumeCard?.querySelector<HTMLImageElement>(
        "#sugestion-two-image"
      );
      if (
        !resumeCard ||
        !textElement ||
        !priceElement ||
        !principalProductImage ||
        !sugestionOneImage ||
        !sugestionTwoImage
      )
        return;
      const [principalImage, sugestionOne, sugestionTwo] = resumedData.images;
      const qtdOfProducts = resumedData.images.length - 1;
      if (qtdOfProducts === 0) {
        textElement.textContent = `Levar somente o produto principal por:`;
      } else if (qtdOfProducts === 1) {
        textElement.textContent = `Compre junto mais 1 produto por:`;
      } else {
        textElement.textContent = `Compre junto mais ${qtdOfProducts} produtos por:`;
      }
      const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        }).format(price);
      };
      priceElement.textContent = formatPrice(resumedData.total);

      principalProductImage.setAttribute("srcset", principalImage.srcSet ?? "");
      principalProductImage.src = principalImage.src;
      if (sugestionOne) {
        sugestionOneImage.classList.remove("hidden");
        sugestionOneImage.setAttribute("srcset", sugestionOne.srcSet ?? "");
        sugestionOneImage.src = sugestionOne.src;
      } else {
        sugestionOneImage.classList.add("hidden");
      }
      if (sugestionTwo) {
        sugestionTwoImage.classList.remove("hidden");
        sugestionTwoImage.setAttribute("srcset", sugestionTwo.srcSet ?? "");
        sugestionTwoImage.src = sugestionTwo.src;
      } else {
        sugestionTwoImage.classList.add("hidden");
      }
    },
    addProductsToCart: () => {
      const allProductCards = document.querySelectorAll<HTMLInputElement>(
        "#buy-together div[data-product-id]"
      );
      const skuIdsToAdd = Array.from(allProductCards).reduce<string[]>(
        (acc, card) => {
          const isActive = card.querySelector<HTMLInputElement>(
            "input#product-checkbox"
          )?.checked;
          if (!isActive) return acc;
          const productData = JSON.parse(
            card.querySelector<HTMLInputElement>("input#product-data")?.value ??
              "[]"
          ) as BuyTogetherProduct[];
          const selectedColor =
            card.querySelector<HTMLSelectElement>("select#color")?.value ?? "";
          const selectedSize =
            card.querySelector<HTMLSelectElement>("select#size")?.value ?? "";
          const finedProduct = productData.find(
            (p) => p.color === selectedColor && p.size === selectedSize
          );
          if (!finedProduct) return acc;
          return [...acc, finedProduct.skuId];
        },
        []
      );
      window.STOREFRONT.CART.addToCart({} as unknown, {
        allowedOutdatedData: ["paymentData"],
        orderItems: skuIdsToAdd.map((skuId) => ({
          quantity: 1,
          seller: "1",
          id: skuId,
        })),
      });
      document
        .querySelector<HTMLInputElement>(`input#${minicartDrawerId}`)
        ?.click();
    },
  };
  globalThis.addEventListener("load", () => {
    window.BUY_TOGETHER?.updateProductResume();
  });
};
