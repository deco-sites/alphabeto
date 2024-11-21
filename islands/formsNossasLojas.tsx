import Icon from "site/components/ui/Icon.tsx";

import { useState } from "preact/compat";

interface StoreInfo {
    distance: number,
    name: string,
    id: number,
    address: {
        postalCode: string,
        city: string,
        state: string,
        neighborhood: string,
        street: string,
        number: number
        location: {
          latitude: number,
          longitude: number
        },
    },
    businessHours: {
        dayOfWeek: string,
        openingTime: number,
        closingTime: number,
    }
  }

interface Stores {
    stores: StoreInfo[]
}

const days = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
]

export default function FormsNossasLojas({ stores }: Stores){
    const [showFiltered, setShowFiltered] = useState(false)
    const [queryInput, setQueryInput] = useState("")
    const [filtered, setFiltered] = useState<StoreInfo[]>([]) 
    const [IsCicked, setIsClicked] = useState<number | null>(null)

    const handleClick = (index: number) => {
            setIsClicked(index)
    } 

    const handleFilter = () => {
        const result = stores.filter((store) => {
            return Object.values(store).some((value) => 
            value.toString().toLowerCase().includes(queryInput.toLowerCase())
            )
        }
        )
        setShowFiltered(!showFiltered)
        setFiltered(result)
    }

    return(
        <div class="mt-[30px]">
            <section>
                <p class="font-bold text-[14px] text-[#676767]">Busque por cidade, CEP, endereço ou loja:</p>
                <form class="flex justify-between mt-[10px]" action="">
                    <input class="w-[64%] h-[44px] border-[1px] border-[#F7E0BF] rounded-[8px] py-[15px] pl-[20px]" value={queryInput} onChange={(e: React.TargetedEvent<HTMLInputElement>) => setQueryInput(e.currentTarget.value)} type="text" placeholder="Buscar"/>
                    <button class="w-[34%] h-[44px] font-bold text-[#ffffff] bg-[#FF8300] rounded-[8px]" type="button" onClick={handleFilter}>Buscar</button>
                </form>
            </section>
            <section class="mt-[30px] w-[100%] h-[370px] overflow-auto customizeScroll">
            
            {showFiltered ? (
            filtered?.map((store, index) => (
                    <>
                    <div onClick={() => handleClick(index)} key={index} class={`flex justify-between items-center w-[95%] h-[194px] border ${IsCicked === index ? "border-[#FF8300]": "border-[#F5F4F1]" } rounded-[8px] px-[10px] mb-[16px]`}>
                        <div>
                            <div class="flex items-center">
                                <Icon id="logo_store" class="pt-[2px]"/>
                                <p class="font-bold text-[14px] text-[#7E7F88]">{store.name}</p>
                            </div>
                            <div class="py-[14px] font-regular text-[12px] text-[#7E7F88]">
                                <p>{store.address.state}</p>
                                <p>{store.address.street}, {store.address.number} - {store.address.neighborhood}</p>
                                <p>CEP: {store.address.postalCode}</p>
                            </div>
                            <div class="w-[100%] flex items-center justify-between pb-[14px]">
                                <p class="font-regular text-[12px] text-[#7E7F88]">+55 0 0000-0000</p>
                                <button class="w-[50%] bg-[#33D26B] h-[30px] rounded[8px] text-[65%] text-[#ffffff] font-bold rounded-[8px]">Enviar mensagem</button>
                            </div>
                            <div>
                                <button class="font-[12px] text-[#FF8300] font-bold underline">Ver no mapa</button>
                            </div>
                        </div>
                        <div class="w-[221px] h-[174px] pt-[10px] bg-[#FDF6ED] flex flex-col items-center rounded-[8px]">
                            <p class="font-bold text-[12px] text-[#676767]">Horários de funcionamento:</p>
                            <div class="mt-[10px]">
                            {days.map((index) => (
                                <p class="font-regular text-[12px] text-[#7E7F88]" key={index}><b>{index}: </b> 
                                {
                                index == 'Domingo' ? `${store.businessHours.openingTime}h às ${store.businessHours.closingTime}h` 
                                : 
                                `${store.businessHours.openingTime}h às ${store.businessHours.closingTime}h`
                                }
                                </p>
                            ))
                            }
                            </div>
                        </div>
                    </div>
                        <hr class=" w-[95%] border-t border-dotted border-[#F7E0BF] my-4" />
                </>
                ))) : (
                
                stores.map((store, index) => (
                    <>
                    <div onClick={() => handleClick(index)} key={index} class={`flex justify-between items-center w-[95%] h-[194px] border ${IsCicked === index ? "border-[#FF8300]": "border-[#F5F4F1]" } rounded-[8px] px-[10px] mb-[16px]`}>
                        <div>
                            <div class="flex items-center">
                                <Icon id="logo_store" class="pt-[2px]"/>
                                <p class="font-bold text-[14px] text-[#7E7F88]">{store.name}</p>
                            </div>
                            <div class="py-[14px] font-regular text-[12px] text-[#7E7F88]">
                                <p>{store.address.state}</p>
                                <p>{store.address.street}, {store.address.number} - {store.address.neighborhood}</p>
                                <p>CEP: {store.address.postalCode}</p>
                            </div>
                            <div class="w-[100%] flex items-center justify-between pb-[14px]">
                                <p class="font-regular text-[12px] text-[#7E7F88]">+55 0 0000-0000</p>
                                <button class="w-[50%] bg-[#33D26B] h-[30px] rounded[8px] text-[65%] text-[#ffffff] font-bold rounded-[8px]">Enviar mensagem</button>
                            </div>
                            <div>
                                <button class="font-[12px] text-[#FF8300] font-bold underline">Ver no mapa</button>
                            </div>
                        </div>
                        <div class="w-[221px] h-[174px] pt-[10px] bg-[#FDF6ED] flex flex-col items-center rounded-[8px]">
                            <p class="font-bold text-[12px] text-[#676767]">Horários de funcionamento:</p>
                            <div class="mt-[10px]">
                            {days.map((index) => (
                                <p class="font-regular text-[12px] text-[#7E7F88]" key={index}><b>{index}: </b> 
                                {
                                index == 'Domingo' ? `${store.businessHours.openingTime}h às ${store.businessHours.closingTime}h` 
                                : 
                                `${store.businessHours.openingTime}h às ${store.businessHours.closingTime}h`
                                }
                                </p>
                            ))
                            }
                            </div>
                        </div>
                    </div>
                        <hr class=" w-[95%] border-t border-dotted border-[#F7E0BF] my-4" />
                </>
                )))}
            </section>
        </div>
    )
}