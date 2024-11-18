import Icon from "site/components/ui/Icon.tsx";

const lojas = [
    {
        loja: "Shopping Manauara",
        city: "Manaus",
        address: "Avenida Mário Ypiranga",
        number: "1300",
        neighborhood: "Adrianópolis",
        cep: "69053-165",
        phone: "+55 92 9448-1001",
        timeOpenSunday: "12:00",
        timeCloseSunday: "21:00",
        timeOpenWeek: "10:00",
        timeCloseWeek: "22:00"
    },
    {
        loja: "Shopping Manauara",
        city: "Manaus",
        address: "Avenida Mário Ypiranga",
        number: "1300",
        neighborhood: "Adrianópolis",
        cep: "69053-165",
        phone: "+55 92 9448-1001",
        timeOpenSunday: "12:00",
        timeCloseSunday: "21:00",
        timeOpenWeek: "10:00",
        timeCloseWeek: "22:00"
    },
    {
        loja: "Shopping Manauara",
        city: "Manaus",
        address: "Avenida Mário Ypiranga",
        number: "1300",
        neighborhood: "Adrianópolis",
        cep: "69053-165",
        phone: "+55 92 9448-1001",
        timeOpenSunday: "12:00",
        timeCloseSunday: "21:00",
        timeOpenWeek: "10:00",
        timeCloseWeek: "22:00"
    }
]

const days = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
]

export default function FormsNossasLojas(){
    return(
        <div class="mt-[30px]">
            <section>
                <p class="font-bold text-[14px] text-[#676767]">Busque por cidade, CEP, endereço ou loja:</p>
                <form class="flex justify-between mt-[10px]" action="">
                    <input class="w-[64%] h-[44px] border-[1px] border-[#F7E0BF] rounded-[8px] py-[15px] pl-[20px]" type="text" placeholder="Buscar"/>
                    <button class="w-[34%] h-[44px] font-bold text-[#ffffff] bg-[#FF8300] rounded-[8px]" type="submit">Buscar</button>
                </form>
            </section>
            <section class="mt-[30px] w-[100%] h-[420px] overflow-auto">
                {lojas.map((store, index) => (
                    <div key={index} class="flex justify-between items-center w-[95%] h-[194px] border border-[#FF8300] rounded-[8px] px-[10px]">
                        <div>
                            <div class="flex items-center">
                                <Icon id="logo_store"/>
                                <p class="font-bold text-[14px] text-[#7E7F88]">{store.loja}</p>
                            </div>
                            <div class="py-[14px] font-regular text-[12px] text-[#7E7F88]">
                                <p>{store.city}</p>
                                <p>{store.address}, {store.number} - {store.neighborhood}</p>
                                <p>CEP: {store.cep}</p>
                            </div>
                            <div class="w-[100%] flex items-center justify-between pb-[14px]">
                                <p class="font-regular text-[12px] text-[#7E7F88]">{store.phone}</p>
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
                                index == 'Domingo' ? `${store.timeOpenSunday}h às ${store.timeCloseSunday}h` 
                                : 
                                `${store.timeOpenWeek}h às ${store.timeCloseWeek}h`
                                }
                                </p>
                            ))
                            }
                            </div>
                        </div>
                    </div>
                ))

                }
            </section>
        </div>
    )
}