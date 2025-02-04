import Icon from "site/components/ui/Icon.tsx";

import { useSignalEffect } from "@preact/signals";
import { Primitive } from "npm:utility-types@3.10.0";
import { useState } from "preact/compat";
import { currentStoreId } from "site/islands/Map.tsx";
import { ItemWithWhatsapp } from "site/sections/NossasLojas/types.ts";

interface Stores {
  stores: ItemWithWhatsapp[];
}

const days = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function deepObjectValues(obj: object): Primitive[] {
  if (obj === null) return [null];
  return Object.values(obj).flatMap((value) =>
    typeof value === "object" ? deepObjectValues(value) : value
  );
}

export default function FormsNossasLojas({ stores }: Stores) {
  const [queryInput, setQueryInput] = useState("");
  const [filtered, setFiltered] = useState<ItemWithWhatsapp[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const handleClick = (id: string) => {
    currentStoreId.value = id;
  };

  const handleFilter = () => {
    const result = stores.filter((store) => {
      return deepObjectValues(store).some((value) =>
        value?.toString().toLowerCase().includes(queryInput.toLowerCase())
      );
    });

    setFiltered(result);
  };

  useSignalEffect(() => {
    if (currentStoreId.value) {
      const result = stores.filter((store) =>
        store.id === currentStoreId.value
      );
      if (result.length > 0) {
        setFiltered(result);
        setSelectedIndex(currentStoreId.value);
      }
    } else {
      setSelectedIndex(null);
      setFiltered([]);
    }
  });

  const content = filtered.length === 0 ? stores : filtered;

  return (
    <div class="mt-[30px] mobile:mb-[45px]">
      <section>
        <p class="font-bold text-[14px] text-accent">
          Busque por cidade, CEP, endereço ou loja:
        </p>
        <form
          class="flex justify-between mt-[10px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleFilter();
          }}
        >
          <input
            class="w-[64%] h-[44px] border-[1px] border-secondary rounded-[8px] py-[15px] pl-[20px]"
            value={queryInput}
            onChange={(e: React.TargetedEvent<HTMLInputElement>) =>
              setQueryInput(e.currentTarget.value)}
            type="text"
            placeholder="Buscar"
          />
          <button
            class="w-[34%] h-[44px] font-bold text-[#ffffff] bg-primary rounded-[8px]"
            type="submit"
            onClick={handleFilter}
          >
            Buscar
          </button>
        </form>
      </section>
      <section class="mt-[30px] w-[100%] h-[370px] overflow-auto customizeScroll">
        {content?.map((store) => (
          <>
            <div
              onClick={() => handleClick(store.id)}
              key={store.id}
              class={`flex mobile:flex-col mobile:justify-start justify-between items-left w-[95%] h-[194px] mobile:h-[403px] border ${
                selectedIndex === store.id
                  ? "border-primary"
                  : "border-primary-content"
              } rounded-[8px] p-2.5 mb-[16px]`}
            >
              <div>
                <div class="flex items-center">
                  <Icon id="logo_store" class="pt-[2px]" />
                  <p class="font-bold text-[14px] text-[#7E7F88]">
                    {store.name}
                  </p>
                </div>
                <div class="w-[100%] py-[14px] font-regular text-[12px] text-[#7E7F88]">
                  <p>{store.address.city}</p>
                  <p>
                    {store.address.street}, {store.address.number} -{" "}
                    {store.address.neighborhood}
                  </p>
                  <p>
                    CEP: {store.address.postalCode} - {store.address.city} -
                    {" "}
                    {store.address.state}
                  </p>
                </div>
                <div class="w-[266px] flex items-center justify-between pb-[14px]">
                  <p class="font-regular text-[12px] text-[#7E7F88]">
                    {store.whatsapp}
                  </p>
                  <a
                    class="flex items-center justify-center w-[50%] bg-[#33D26B] h-[30px] rounded[8px] text-[65%] text-[#ffffff] font-bold rounded-[8px] mr-[24px]"
                    href={`https://wa.me/${
                      store.whatsapp?.replace(/[\s\-()]/g, "")
                    }`}
                  >
                    <Icon
                      class="mr-[4px]"
                      id="whatsappIcon"
                      width="16"
                      height="16"
                    />
                    Enviar mensagem
                  </a>
                </div>
                <div>
                  <button
                    onClick={() => {
                      currentStoreId.value = store.id;
                    }}
                    class="font-[12px] text-primary font-bold underline"
                  >
                    Ver no mapa
                  </button>
                </div>
              </div>
              <div class="w-[221px] h-[174px] pt-[10px] mobile:mt-[10px] bg-secondary-content flex flex-col items-center rounded-[8px]">
                <p class="font-bold text-[12px] text-accent">
                  Horários de funcionamento:
                </p>
                <div class="mt-[10px]">
                  {store.businessHours.map((hour, index) => (
                    <p
                      class="font-regular text-[12px] text-[#7E7F88]"
                      key={index}
                    >
                      <b>{days[hour.dayOfWeek]}:</b>
                      `{hour.openingTime.slice(0, 5)}h às{" "}
                      {hour.closingTime.slice(0, 5)}h`
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <hr class=" w-[95%] border-t border-dotted border-secondary my-4" />
          </>
        ))}
      </section>
    </div>
  );
}
