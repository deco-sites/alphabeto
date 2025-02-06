import { CustomPart } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import { useState } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";
import { invoke } from "site/runtime.ts";
import {
  PlataformProps,
} from "site/components/product/ProductBuyTogether/types.ts";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { MINICART_DRAWER_ID } from "site/constants.ts";
import generateImageAction from "site/actions/minime/generateImageMiniMe.ts";

interface Props {
  popupTitle?: RichText;
  popupTerms?: RichText;

  dollParts: CustomPart[];

  page: ProductDetailsPage | null;

  handlePopup: (value: boolean) => void 
}

export const getImageMiniMe = () => {
  const local = localStorage.getItem('imageMiniMe')
  console.log('image2: ', local)
  return local
}

export default function PopupMiniMe(
  { popupTitle, popupTerms, dollParts, page, handlePopup }: Props
) {

  const [IsChecked, setIsChecked] = useState(false);
  const [doll, setDoll] = useState<CustomPart[]>([]);
  setDoll(dollParts);

  const types = [
    "Corpinho",
    "Cabelinho",
    "Rostinho",
    "Lookinho",
    "Jeitinho",
    "Cheirinho",
  ];

  const seller = page?.product.offers?.offers[0].seller
    ? page?.product.offers?.offers[0].seller
    : "1";
  const price = page?.product.offers?.offers[0].price
    ? page?.product.offers?.offers[0].price
    : 18995;
  const formatedPrice = JSON.stringify(price).replace(/\./g, ",");
  const formatedDividedPrice = JSON.stringify(price / 2).replace(/\./g, ",");

  const handleCheck = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setIsChecked(target.checked);
  };

  const buildMiniMe: () => Promise<Record<string, string> | undefined> = async () => {

    let minime = ""

      const minimeStructure = {
        cheirinho: {
          cheiro: dollParts[5].nome
        },
        frente: {
          cabelo: {
            cod: dollParts[1].img_frente.replace(/.*_(C\d+)\.png/, "$1"),
            img_baixa: dollParts[1].img_frente,
            img_alta: dollParts[1].img_frente_alta,
          },
          face: {
            cod: dollParts[2].img_frente.replace(/.*_(F\d+)\.png/, "$1"),
            img_baixa: dollParts[2].img_frente,
            img_alta: dollParts[2].img_frente_alta,
          },
          pele: {
            cod: dollParts[0].img_frente.replace(/.*_(P\d+)\.png/, "$1"),
            img_baixa: dollParts[0].img_frente,
            img_alta: dollParts[0].img_frente_alta,
          },
          roupa: {
            cod: dollParts[3].img_frente.replace(/.*_(R\d+)\.png/, "$1"),
            img_baixa: dollParts[3].img_frente,
            img_alta: dollParts[3].img_frente_alta,
          },
          acessório: {
            cod: dollParts[4].img_costas.replace(/.*_(A\d+)\.png/, "$1"),
            img_baixa: dollParts[4].img_frente,
            img_alta: dollParts[4].img_frente_alta,
          },
        },
        costas: {
          cabelo: {
            cod: dollParts[1].img_costas.replace(/.*_(C\d+)\.png/, "$1"),
            img_baixa: dollParts[1].img_costas,
            img_alta: dollParts[1].img_costas_alta
          },
          pele: {
            cod: dollParts[0].img_costas.replace(/.*_(P\d+)\.png/, "$1"),
            img_baixa: dollParts[0].img_costas,
            img_alta: dollParts[0].img_costas_alta
          },
          roupa: {
            cod: dollParts[3].img_costas.replace(/.*_(R\d+)\.png/, "$1"),
            img_baixa: dollParts[3].img_costas,
            img_alta: dollParts[3].img_costas_alta
          },
          acessorio: {
            cod: dollParts[4].img_costas.replace(/.*_(A\d+)\.png/, "$1"),
            img_baixa: dollParts[4].img_costas,
            img_alta: dollParts[4].img_costas_alta
          },
        }
      }
      minime = JSON.stringify(minimeStructure)

      const response = await fetch("/_v/api/service/generateFinalImage", {
        method: "POST",
        body: minime,
        headers: {
          accept: "application/json, text/java, */*; q=0.01",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json; charset=UTF-8"
        }
      });

      let data = await response.json()
      console.log("dataaa: ", data)

      let datasecond = await invoke.site.actions.generateImageMiniMe({
        body: minime
      })

      const data2 = datasecond
      console.log("data2: ", datasecond.body)

      data = {
        ...data,
        infos: {
          cor: dollParts[0].img_frente.replace(/.*_(P\d+)\.png/, "$1"),
          cabelo: dollParts[1].img_frente.replace(/.*_(C\d+)\.png/, "$1"),
          olhos: dollParts[2].img_frente.replace(/.*_(F\d+)\.png/, "$1"),
          vestido: dollParts[3].img_frente.replace(/.*_(R\d+)\.png/, "$1"),
          acessorio: dollParts[4].img_costas.replace(/.*_(A\d+)\.png/, "$1"),
          cheirinho: dollParts[5].nome
        }
      }

      

      if(data.frente){
        
      data.frente.img_alta =
      window.location.protocol +
      "//" +
      "alphabeto.com" +
      data?.frente?.img_alta +
      "?v=1";
      data.frente.img_baixa =
      window.location.protocol +
      "//" +
      "alphabeto.com" +
      data?.frente?.img_baixa +
      "?v=1";

      const image = JSON.stringify(data.frente.img_baixa) 
      }

      if(data.costas){
        
        data.costas.img_alta =
        window.location.protocol +
        "//" +
        "alphabeto.com" +
        data?.costas?.img_alta +
        "?v=1";
        data.costas.img_baixa =
        window.location.protocol +
        "//" +
        "alphabeto.com" +
        data?.costas?.img_baixa +
        "?v=1";
        }


    return data
  }

  const addToCart = () => {
      console.log("page: ", page);
      const img = localStorage.getItem('imageMiniMe')
      if (page) {
        const plataformProps: PlataformProps = {
          allowedOutdatedData: ["paymentData"],
          orderItems: [{
            quantity: 1,
            seller: seller,
            id: page?.product.sku,
          }],
        };
        window.STOREFRONT.CART.addToCart({
          item_id: page?.product.sku,
          listPrice: price,
          image: "",
          color: "",
          size: "",
          item_name: "almofada-boneca-mini-me",
          quantity: 1,
          item_variant: "",
        }, plataformProps);
        document.querySelector<HTMLInputElement>(`input#${MINICART_DRAWER_ID}`)
          ?.click();
      }
    }

    const addMiniMe = async () => {
      const data = await buildMiniMe()
      console.log(data)
      if(IsChecked === true){
        addToCart();
        const carrinho = await invoke.vtex.loaders.cart();
        console.log(carrinho);
        const cartIndex = carrinho.items.length - 1;
  
        await invoke.vtex.actions.cart.updateItemAttachment(
          {
            index: cartIndex,
            attachment: "boneca customizada",
            content: {
              json: JSON.stringify(data)
            }
          },
        );
      }

      const carrinho2 = await invoke.vtex.loaders.cart();
      console.log("2", carrinho2);
  };

  return (
    <>
      <div class="fixed top-0 left-0 z-[100] bg-[#000] w-full h-full opacity-[25%]" />
      <section class="fixed z-[1000] top-[199px] left-[50%] -translate-x-1/2">
        <section class="relative flex w-[870px] bg-[#fff] rounded-[8px]">
          <Icon id="close" onClick={() => handlePopup(false)} class="pointer text-[#FF8300] absolute right-0 m-[12px]" />
          <div class="relative max-w-[259px] w-full bg-[#F7E0BF] h-[420px] rounded-tl-[8px] rounded-bl-[8px]">
            {doll.map((doll, index) => (
              <Image
                key={index}
                src={doll.img_frente}
                width={259}
                height={376}
                class={`absolute mobile:top-0 mobile:left-0
                    ${doll.id === "44" ? "" : `z-[10]`} 
                    ${
                  doll.oculto === true
                    ? "hidden"
                    : parseInt(doll.id_tipo) === 8
                    ? "hidden"
                    : doll.id === "71"
                    ? "hidden"
                    : ""
                }
                  `}
              />
            ))}
          </div>

          <div class="flex flex-col ">
            <div class="p-[25px]">
              <h2
                dangerouslySetInnerHTML={{
                  __html: popupTitle ? popupTitle : "",
                }}
                class="font-beccaPerry mb-[23px]"
              />
              <div class="flex flex-col font-Quicksand mb-[37px]">
                {doll.map((doll, index) => (
                  <p key={index} class="text-[#676767]">
                    <b>{types[index]}</b>: {doll.nome}
                  </p>
                ))}
              </div>
              <span class="flex items-center">
                <input
                  type="checkbox"
                  class="mr-[8px] w-[16px] h-[16px] appearance-none border-2 border-[#FF8300] rounded-md checked:bg-[#FF8300] checked:border-[#FF8300] checked:text-white flex items-center justify-center"
                  checked={IsChecked}
                  onChange={handleCheck}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: popupTerms ? popupTerms : "",
                  }}
                  class="font-Quicksand"
                />
              </span>
              <span class="flex items-center mt-[16px]">
                <div class="flex flex-col mobile:items-center justify-start mobile:justify-center w-full mobile:mb-[20px]">
                  <h3 class="font-Quicksand font-bold text-[26px] mobile:text-[18px] text-[#676767]">
                    Total: <b class="text-[#FF8300]">R$ {formatedPrice}</b>
                  </h3>
                  <p class="font-Quicksand text-[#7E7F88] mobile:text-[12px]">
                    Em até 2x R$ {formatedDividedPrice.replace("5", "")}{" "}
                    sem juros
                  </p>
                </div>
                <div class="flex items-center justify-end w-full">
                  <button
                    onClick={addMiniMe}
                    class="font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]"
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </span>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
