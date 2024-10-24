import { useScript } from "@deco/deco/hooks";
import { useComponent } from "../../../sections/Component.tsx";
import { IconOffersLocal } from "../../Icons/IconOffersLocal.tsx";
import Button, { ButtonLabel, ButtonType } from "../../ui/Button.tsx";
import Icon from "../../ui/Icon.tsx";
import Input from "../../ui/Input.tsx";
import Modal from "../../ui/Modal.tsx";
import { ResultProps } from "./result.tsx";

export const ids = {
  GEOLOCATION_OFFERS_MODAL_ID: "geolocation-offers-modal",
  GEOLOCATION_CEP_INPUT_ID: "modal-gelocation-offers-cep",
  GEOLOCATION_USE_LOCATION_BUTTON_ID: "modal-gelocation-offers-use-location",
  GEOLOCATION_OFFERS_FORM_ID: "modal-gelocation-offers-form",
  GEOLOCATION_OFFERS_MODAL_CONTENT_ID: "modal-gelocation-offers-content",
};
const loadScript = ({ GEOLOCATION_CEP_INPUT_ID, GEOLOCATION_USE_LOCATION_BUTTON_ID }: typeof ids, googleMapsApiKey: string) => {
  const maskCEP = () => {
    const cepInput = document.getElementById(GEOLOCATION_CEP_INPUT_ID) as HTMLInputElement | null;
    if (!cepInput) return;
    const mask = (value: string) => value.replace(/\D/g, "").replace(/(\d{5})(\d{3})?/, "$1-$2");
    cepInput.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      const value = target.value;
      target.value = mask(value);
    });
  };
  const applyGetLocation = () => {
    const button = document.getElementById(GEOLOCATION_USE_LOCATION_BUTTON_ID) as HTMLButtonElement | null;
    const cepInput = document.getElementById(GEOLOCATION_CEP_INPUT_ID) as HTMLInputElement | null;
    if (!googleMapsApiKey) return;
    if (!cepInput) return;
    if (!button) return;

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch("https://maps.google.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=false&key=" + googleMapsApiKey)
            .then((response) => response.json())
            .then((data) => {
              const address = data.results[0].address_components;
              const cep = address.find((component: any) => component.types.includes("postal_code"));
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
        }
      );
    };

    button.addEventListener("click", fetchLocation);
  };
  maskCEP();
  applyGetLocation();
};

interface Props {
  googleMapsApiKey: string;
}

const GeolocationOffersResult = import.meta.resolve("./result.tsx");

export default function GeolocationOffers(props: Props) {
  return (
    <>
      <Modal id={ids.GEOLOCATION_OFFERS_MODAL_ID}>
        <div className="absolute bg-secondary-content rounded-lg top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 max-w-[335px]" id={ids.GEOLOCATION_OFFERS_MODAL_CONTENT_ID}>
          <div className="relative flex flex-col p-5">
            <label type="button" class="cursor-pointer absolute right-[14px] top-[14px] text-primary" for={ids.GEOLOCATION_OFFERS_MODAL_ID} aria-label="Close Geolocation Offer Modal">
              <Icon id="close" size={20} />
            </label>
            <h3 className="text-[#676767] text-[25px] leading-[30px] font-['BeccaPerry'] text-center mb-[10px]">
              Quer <span className="text-primary">ofertas?</span>
            </h3>
            <p className="text-[#7e7f88] text-xs leading-[18px] text-center w-[295px]">
              Coloque o seu <strong>CEP</strong> que achamos os <strong>melhores preços</strong> e <strong>prazos de entrega</strong> perto de você.
            </p>
            <form
              id={ids.GEOLOCATION_OFFERS_FORM_ID}
              className="flex flex-col mt-4"
              hx-post={useComponent<ResultProps>(GeolocationOffersResult, {
                result: "Success",
              })}
              hx-target={`#${ids.GEOLOCATION_OFFERS_MODAL_CONTENT_ID}`}
              hx-swap="innerHTML"
            >
              <label for={ids.GEOLOCATION_CEP_INPUT_ID} className="text-[#676767] text-xs leading-[18px] mb-1 font-bold">
                CEP
              </label>
              <Input id={ids.GEOLOCATION_CEP_INPUT_ID} type="text" placeholder="Digite seu CEP" />
              <button type="button" className="flex gap-1 text-primary text-sm mt-5 mb-9" id={ids.GEOLOCATION_USE_LOCATION_BUTTON_ID}>
                <Icon id="location_pin" size={20} />
                <span className="underline">Utilizar minha localização</span>
              </button>
              <div className="grid grid-cols-2 gap-[10px]">
                <ButtonLabel styleType={ButtonType.Tertiary} type="button" for={ids.GEOLOCATION_OFFERS_MODAL_ID} className="h-11" aria-label="Close Geolocation Offer Modal">
                  cancelar
                </ButtonLabel>
                <Button className="h-11" type="submit" for={ids.GEOLOCATION_OFFERS_FORM_ID}>
                  continuar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <label for={ids.GEOLOCATION_OFFERS_MODAL_ID} type="button" class="text-[13px] desk-small:text-[12px] text-base-200 leading-[19px] font-bold flex items-center whitespace-nowrap text-left gap-1 hover:text-[#d6de23] cursor-pointer">
        <IconOffersLocal />
        Ofertas da <br></br> minha cidade
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(loadScript, ids, props.googleMapsApiKey),
        }}
      />
    </>
  );
}
