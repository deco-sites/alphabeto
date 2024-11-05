import { useScript } from "@deco/deco/hooks";
import { TypedResponse } from "apps/utils/http.ts";
import { AppContext } from "apps/vtex/mod.ts";
import { getCookies } from "std/http/cookie.ts";
import { useComponent } from "../../../sections/Component.tsx";
import { IconOffersLocal } from "../../Icons/IconOffersLocal.tsx";
import Button, { ButtonLabel, ButtonType } from "../../ui/Button.tsx";
import Icon from "../../ui/Icon.tsx";
import Input from "../../ui/Input.tsx";
import Modal from "../../ui/Modal.tsx";

export const ids = {
  GEOLOCATION_OFFERS_WRAPPER_ID: "geolocation-offers-wrapper",
  GEOLOCATION_OFFERS_MODAL_ID: "geolocation-offers-modal",
  GEOLOCATION_CEP_INPUT_ID: "modal-gelocation-offers-cep",
  GEOLOCATION_USE_LOCATION_BUTTON_ID: "modal-gelocation-offers-use-location",
  GEOLOCATION_OFFERS_FORM_ID: "modal-gelocation-offers-form",
  GEOLOCATION_OFFERS_MODAL_CONTENT_ID: "modal-gelocation-offers-content",
  GEOLOCATION_OFFERS_MODAL_LABEL_OPEN_ID: "modal-gelocation-offers-label-open",
  GEOLOCATION_OFFERS_MODAL_REPLACE_WRAPPER: "modal-geolocation-replace-wrapper",
  GEOLOCATION_OFFERS_FORM_BUTTON_ID: "modal-gelocation-offers-button",
};

interface GoogleGeoPosition {
  results: {
    address_components: {
      long_name: string;
      types: string[];
    }[];
  }[];
}

const loadScript = (
  { GEOLOCATION_CEP_INPUT_ID, GEOLOCATION_USE_LOCATION_BUTTON_ID }: typeof ids,
  googleMapsApiKey: string,
) => {
  const maskCEP = () => {
    const cepInput = document.getElementById(GEOLOCATION_CEP_INPUT_ID) as
      | HTMLInputElement
      | null;
    if (!cepInput) return;
    const mask = (value: string) =>
      value.replace(/\D/g, "").replace(/(\d{5})(\d{3})?/, "$1-$2");
    cepInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      target.value = mask(value);
    });
  };
  const applyGetLocation = () => {
    const button = document.getElementById(
      GEOLOCATION_USE_LOCATION_BUTTON_ID,
    ) as HTMLButtonElement | null;
    const cepInput = document.getElementById(GEOLOCATION_CEP_INPUT_ID) as
      | HTMLInputElement
      | null;
    if (!googleMapsApiKey) return;
    if (!cepInput) return;
    if (!button) return;

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            "https://maps.google.com/maps/api/geocode/json?latlng=" + latitude +
              "," + longitude + "&sensor=false&key=" + googleMapsApiKey,
          )
            .then((response) => response.json())
            .then((data: GoogleGeoPosition) => {
              const address = data.results[0].address_components;
              const cep = address.find((component) =>
                component.types.includes("postal_code")
              );
              if (cep) {
                cepInput.value = cep.long_name;
              } else {
                alert("Não foi possível obter o CEP da sua localização");
              }
            })
            .catch(() => {
              alert("Não foi possível obter a sua localização");
            });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Você negou a permissão de localização");
          } else {
            alert("Não foi possível obter a sua localização");
          }
        },
      );
    };

    button.addEventListener("click", fetchLocation);
  };
  maskCEP();
  applyGetLocation();
};

interface Props {
  googleMapsApiKey: string;
  cep?: string;
}

const numberOnly = (value: string) => value.replace(/\D/g, "");

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  let cep = props.cep;
  const isPost = req.method.toLowerCase() === "post";
  if (isPost) {
    const formData = await req.formData();
    const formCEP = formData.get("cep")?.toString();
    if (formCEP?.length) cep = formCEP;
  }

  if (cep && cep.length === 9 && isPost) {
    const vtexClient = await ctx.invoke.vtex.loaders.config();
    interface VtexPostalCodeResponse {
      country: string;
      postalCode: string;
      city: string;
    }
    const postalCodeResponse = (await vtexClient.vcs
      ["GET /api/checkout/pub/postal-code/:countryCode/:postalCode"]({
        countryCode: "BRA",
        postalCode: numberOnly(cep),
      })) as TypedResponse<VtexPostalCodeResponse>;
    const { country, postalCode, city } = await postalCodeResponse.json();

    const cookies = getCookies(req.headers);
    const segmentCookie = cookies["vtex_segment"];
    const sessionCookie = cookies["vtex_session"];
    if (!segmentCookie || !sessionCookie) {
      const headers = new Headers();
      headers.append("content-type", "application/json");
      const sessionResponse = await fetch(
        `https://alphabeto.myvtex.com/api/sessions`,
        {
          method: "POST",
          body: JSON.stringify({
            public: {
              city: {
                value: city,
              },
              postalCode: {
                value: postalCode,
              },
              country: {
                value: country,
              },
            },
          }),
          headers,
        },
      );
      interface VtexSessionResponse {
        sessionToken: string;
        segmentToken: string;
      }
      const sessionData = (await sessionResponse.json()) as VtexSessionResponse;
      ctx.response.headers.set(
        "Set-Cookie",
        `vtex_session=${sessionData.sessionToken}; vtex_segment=${sessionData.segmentToken}; Path=/;`,
      );
    } else {
      const headers = new Headers();
      headers.append("content-type", "application/json");
      headers.append(
        "Cookie",
        `vtex_session=${sessionCookie}; vtex_segment=${segmentCookie}`,
      );
      await fetch(`https://alphabeto.myvtex.com/api/sessions`, {
        method: "PUT",
        body: JSON.stringify({
          public: {
            city: {
              value: city,
            },
            postalCode: {
              value: postalCode,
            },
            country: {
              value: country,
            },
          },
        }),
        headers,
      });
    }

    return {
      ...props,
      cep,
    };
  }
};

export default function GeolocationOffers(props: Props) {
  return (
    <div id={ids.GEOLOCATION_OFFERS_MODAL_REPLACE_WRAPPER}>
      <Modal id={ids.GEOLOCATION_OFFERS_MODAL_ID}>
        <div
          class="absolute bg-secondary-content rounded-lg top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 max-w-[335px]"
          id={ids.GEOLOCATION_OFFERS_MODAL_CONTENT_ID}
        >
          <div class="relative flex flex-col p-5">
            <label
              type="button"
              class="cursor-pointer absolute right-[14px] top-[14px] text-primary"
              for={ids.GEOLOCATION_OFFERS_MODAL_ID}
              aria-label="Close Geolocation Offer Modal"
            >
              <Icon id="close" size={20} />
            </label>
            <h3 class="text-[#676767] text-[25px] leading-[30px] font-beccaPerry text-center mb-[10px]">
              Quer <span class="text-primary">ofertas?</span>
            </h3>
            <p class="text-[#7e7f88] text-xs leading-[18px] text-center w-[295px]">
              Coloque o seu <strong>CEP</strong> que achamos os{" "}
              <strong>melhores preços</strong> e{" "}
              <strong>prazos de entrega</strong> perto de você.
            </p>
            <form
              id={ids.GEOLOCATION_OFFERS_FORM_ID}
              class="flex flex-col mt-4"
              hx-post={useComponent<Props>(import.meta.url, {
                ...props,
              })}
              hx-target={`#${ids.GEOLOCATION_OFFERS_MODAL_REPLACE_WRAPPER}`}
              hx-swap="outterHTML"
              hx-disabled-elt={`this, #${ids.GEOLOCATION_OFFERS_FORM_BUTTON_ID}`}
              hx-indicator={`#${ids.GEOLOCATION_OFFERS_MODAL_CONTENT_ID}`}
            >
              <label
                for={ids.GEOLOCATION_CEP_INPUT_ID}
                class="text-[#676767] text-xs leading-[18px] mb-1 font-bold"
              >
                CEP
              </label>
              <Input
                id={ids.GEOLOCATION_CEP_INPUT_ID}
                name="cep"
                type="text"
                placeholder="Digite seu CEP"
                value={props.cep}
              />
              <button
                type="button"
                class="flex gap-1 text-primary text-sm mt-5 mb-9"
                id={ids.GEOLOCATION_USE_LOCATION_BUTTON_ID}
              >
                <Icon id="location_pin" size={20} />
                <span class="underline">Utilizar minha localização</span>
              </button>
              <div class="grid grid-cols-2 gap-[10px]">
                <ButtonLabel
                  styleType={ButtonType.Tertiary}
                  type="button"
                  for={ids.GEOLOCATION_OFFERS_MODAL_ID}
                  class="h-11"
                  aria-label="Close Geolocation Offer Modal"
                >
                  cancelar
                </ButtonLabel>
                <Button
                  class="h-11"
                  type="submit"
                  for={ids.GEOLOCATION_OFFERS_FORM_ID}
                  id={ids.GEOLOCATION_OFFERS_FORM_BUTTON_ID}
                >
                  <span class="[.htmx-request_&]:hidden">continuar</span>
                  <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <label
        id={ids.GEOLOCATION_OFFERS_MODAL_LABEL_OPEN_ID}
        for={ids.GEOLOCATION_OFFERS_MODAL_ID}
        type="button"
        class="text-[13px] desk-small:text-[12px] text-base-200 leading-[19px] font-bold flex items-center whitespace-nowrap text-left gap-1 hover:text-[#d6de23] cursor-pointer"
      >
        <IconOffersLocal />
        <span
          dangerouslySetInnerHTML={{
            __html: props.cep
              ? `Enviar para<br>${props.cep}`
              : "Ofertas da<br>minha cidade",
          }}
        />
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(loadScript, ids, props.googleMapsApiKey),
        }}
      />
    </div>
  );
}
