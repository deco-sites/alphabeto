// deno-lint-ignore-file
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/compat";

import { Loader } from "https://esm.sh/@googlemaps/js-api-loader@1.16.6";

interface Props {
    apiKey: string
}

export default function Map({apiKey}: Props) {
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
                    center: { lat: -23.5489, lng: -46.6388 },
                    zoom: 8,
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
                pin = new AdvancedMarkerElement({
                    position: { lat: -23.5489, lng: -46.6388 },
                    map: map,
                })
            })
            })
            .catch((e) => {
                console.error('error:', e)
            })
    }, [])

    return(
        <div>
            <div id="map" class="w-full h-[675px] rounded-[8px]"></div>
        </div>
    )
}