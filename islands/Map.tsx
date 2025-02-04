// deno-lint-ignore-file
import { signal, useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/compat";

import { Loader } from "https://esm.sh/@googlemaps/js-api-loader@1.16.6";
import { ItemWithWhatsapp } from "site/sections/NossasLojas/types.ts";

interface Props {
  apiKey: string;
  stores: ItemWithWhatsapp[];
}

interface Zoom {
  lat: number;
  lng: number;
  zoom: number;
}

export const zoom = signal<Zoom>({
  lat: -23.5489,
  lng: -46.6388,
  zoom: 8,
});

const pinSVG =
  `<svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M32.375 15.833C32.375 26.9163 18.5 36.4163 18.5 36.4163C18.5 36.4163 4.625 26.9163 4.625 15.833C4.625 12.0537 6.08683 8.42913 8.68889 5.75674C11.291 3.08434 14.8201 1.58301 18.5 1.58301C22.1799 1.58301 25.709 3.08434 28.3111 5.75674C30.9132 8.42913 32.375 12.0537 32.375 15.833Z" fill="#D6DE23" stroke="#D6DE23" stroke-width="2.64116" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.5 20.583C21.0543 20.583 23.125 18.4564 23.125 15.833C23.125 13.2097 21.0543 11.083 18.5 11.083C15.9457 11.083 13.875 13.2097 13.875 15.833C13.875 18.4564 15.9457 20.583 18.5 20.583Z" fill="#FF8300" stroke="#FF8300" stroke-width="2.64116" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const currentStoreId = signal("");

export default function Map({ apiKey, stores }: Props) {
  const pins = useSignal<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});

  let infoMarker: google.maps.InfoWindow | null = null;
  let map: google.maps.Map | null = null;

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader
      .importLibrary("maps")
      // deno-lint-ignore no-explicit-any
      .then(({ Map, InfoWindow }) => {
        map = new Map(document.getElementById("map")!, {
          center: { lat: -23.5489, lng: -46.6388 },
          zoom: 8,
          mapId: "DEMO_ID",
          cameraControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: false,
        });

        infoMarker = new InfoWindow();

        infoMarker.addListener("close", () => {
          currentStoreId.value = "";
        });

        loader
          .importLibrary("marker")
          .then(({ AdvancedMarkerElement }) => {
            const domParser = new DOMParser();

            stores.forEach((store) => {
              const svg = domParser.parseFromString(pinSVG, "image/svg+xml")
                .documentElement;
              const pin = new AdvancedMarkerElement({
                content: svg,
                position: {
                  lat: store.address.location.latitude,
                  lng: store.address.location.longitude,
                },

                map: map,
              });
              pin.addListener("click", () => {
                currentStoreId.value = store.id;
              });

              pins.value[store.id] = pin;
            });
          });
      })
      .catch((e) => {
        console.error("error:", e);
      });
  }, []);

  useSignalEffect(() => {
    const store = stores.find((store) => store.id === currentStoreId.value);
    const pin = pins.value[currentStoreId.value];
    if (!store || !pin) return;
    infoMarker?.setContent(store.name);
    infoMarker?.open(map, pin);
    map?.setCenter({
      lat: store.address.location.latitude,
      lng: store.address.location.longitude,
    });
    map?.setZoom(15);
  });

  return (
    <div>
      <div id="map" class="w-full h-[675px] mobile:h-[305px] rounded-[8px]">
      </div>
    </div>
  );
}
