// deno-lint-ignore-file
import { effect, signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/compat";

import { Loader } from "https://esm.sh/@googlemaps/js-api-loader@1.16.6";

interface Props {
    apiKey: string,
    stores: StoreInfo[];
}

interface StoreInfo {
    address: {
      location: {
        latitude: number;
        longitude: number;
      };
    };
}

interface Zoom {
    lat: number,
    lng: number,
    zoom: number
}

export const zoom = signal<Zoom>({
    lat: -23.5489,
    lng: -46.6388,
    zoom: 8
})

export default function Map({apiKey, stores}: Props) {
    let pin: any;
    const current = useSignal("")

    useEffect(() => {
        let map: any;
        const loader = new Loader({
            apiKey,
            version: "weekly",
        })

        loader
            .importLibrary("maps")
            // deno-lint-ignore no-explicit-any
            .then(({ Map }: any) => {
                map = new Map(document.getElementById('map')!, {
                    center: { lat: zoom.value.lat, lng: zoom.value.lng },
                    zoom: zoom.value.zoom,
                    mapId: 'DEMO_ID'
                })
                
                map.addListener("click", (e: {latLng: { lat: () => number; lng: () => number } }) => {
                    const data = ({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    })
                    current.value = `Latitude: ${data.lat}, Longitude: ${data.lng}`

                    pin.setPosition(data.lat, data.lng);
                })
                        
            loader
            .importLibrary("marker")
            .then(({ AdvancedMarkerElement }) => {
                const positions = stores.map(store => ({
                    lat: store.address.location.latitude,
                    lng: store.address.location.longitude
                  }));

                positions.forEach(position => {                    
                    pin = new AdvancedMarkerElement({
                        position: position,
                        map: map,
                    })
                })
            })
            })
            .catch((e) => {
                console.error('error:', e)
            })

            
    },[zoom.value])

    return(
        <div>
            <div id="map" class="w-full h-[675px] mobile:h-[305px] rounded-[8px]"></div>
        </div>
    )
}