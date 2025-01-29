import { LoaderMiniMe } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import { LoaderMiniMeTypes } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import type { CustomPart } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import type { PartType } from "site/islands/contextMiniMe/ContextMiniMe.tsx";

import Image from "apps/website/components/Image.tsx";

import { StateUpdater, useEffect, useState } from "preact/hooks";

import { ImageWidget } from "apps/admin/widgets.ts";

/**@title Informações da Mini Me*/
interface Props {
    /**@title Título da Mini Me*/
    title: string;
    /**@title Preço da boneca (sem R$):*/
    price: number;
    /**@title Até quantas vezes o valor pode ser parcelado:*/
    installments: number; 
    /**@title Imagem de fundo da boneca*/
    image: ImageWidget;
}

export default function MiniMe({ title, price, installments, image }: Props) {
  const [data, setData] = useState<CustomPart[]>([]);
  const [types, setTypes] = useState<PartType[]>([]);
  const [filteredData, setFilteredData] = useState<CustomPart[]>([]);

  const [idCollection, setIdCollection] = useState<string[] | []>([])
  const [dollParts, setDollParts] = useState<CustomPart[]>([])

  const [IsSelected, setIsSelected] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [finalValue, setFinalValue] = useState('')
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    const data = await LoaderMiniMe();
    setData(data);
    const typeSequence = await LoaderMiniMeTypes();
    const typesSorted = [...typeSequence].sort((a, b) => a.ordem - b.ordem);
    setTypes(typesSorted);
  };

  const filterData = (i: number) => {
    localStorage.setItem('types', JSON.stringify(types))
    
    let tempData: StateUpdater<CustomPart[]> = [];
    const typesStorage: PartType[] = JSON.parse(localStorage.getItem('types') || '[]')

    if(typesStorage[i]){
        tempData = data.filter((item) => parseInt(item.id_tipo) === parseInt(typesStorage[i].id));
        tempData = [...tempData].sort((a, b) => parseInt(a.nome) - parseInt(b.nome));
        setFilteredData(tempData);
        console.log('a função foi executada!')
    }
  };

  const clickCount = (operation: string) => {
    let i = 0

    if (operation === 'increment' && count < 6) {
        i = count + 1 
    } else if (operation === 'decrement' && count > 0){
        i = count - 1 
    }

    localStorage.setItem('count', JSON.stringify(i))
    setCount(i);
    filterData(i);
  }

    const selectPart = (id: string, id_type: string) => {

    const typesStorage: PartType[] = JSON.parse(localStorage.getItem('types') || '[]')

    const typeOfIndex = typesStorage.reduce((map, type, index) => {
        map[parseInt(type.id)] = index;
        return map
    }, {} as Record<number, number>)

    const index = typeOfIndex[parseInt(id_type)]

    const parts = JSON.parse(localStorage.getItem('parts') || "[]")
    const identifications  = JSON.parse(localStorage.getItem('ids') || '[]')
 
    if(parts[index] !== id){

        const ids = [...identifications]
        const updateParts = [...parts];

        if(selectedId === id){
            updateParts[index] = ""
            setDollParts(updateParts)
            setIdCollection(ids)
            setSelectedId(id)
            setIsSelected(false)
        } else {
            const selectedImage = filteredData.find((item) => item.id === id)
                if(selectedImage) {
                ids[index] = selectedImage.id;
                updateParts[index] = selectedImage;
                setDollParts(updateParts)
                setIdCollection(ids)
                setSelectedId(id)
                setIsSelected(true)
                }
            }
        }
    }

    const updateDoll = () => {
        const parts = JSON.parse(localStorage.getItem('parts') || '[]')
        setDollParts(parts)

        const i = JSON.parse(localStorage.getItem('count') || '')
        setCount(i)

        const ids = JSON.parse(localStorage.getItem('ids') || '[]')
        setIdCollection(ids)
    }

  useEffect(() => {
    fetchData();
    updateDoll();
    if(installments > 1) {
        const value = price / installments;
        const formatedValue = JSON.stringify(value).replace(/\./g, ',')
        setFinalValue(formatedValue)
    }
  }, []);

  useEffect(() => {
    if (data.length > 0) {
        if(filteredData.length === 0){
            const i = JSON.parse(localStorage.getItem('count') || '0')
            filterData(i);
        }
    }
  }, [data, types, count]);

  if (!data || !types) return null;

  return (
    <>
      <section class="container flex max-w-[1360px] w-full mb-[100px]">
        <section class="relative mr-[30px] px-[55px] py-[33px] bg-[#fff] border-dashed border-[1px] border-[#FF3800] rounded-[8px] max-w-[557px] h-[835px] w-full">
          
          {dollParts.some((part) => part) ? (
          dollParts.map((part, index) => part ? 
          (
            <Image
            key={index}
            src={part.img_frente}
            width={446}
            height={669}
            class={`absolute 
                ${part.id === "44" ? '' : `z-[10]`} ${part.oculto === true || parseInt(part.id_tipo) === 8 ? 'hidden' : ''}`}
          />
          ) : null
        )) : (
            <Image
            src={image}
            width={446}
            height={669}
          />
          )}
        </section>

        <div class="max-w-[773px] w-full h-[735px]">
          <div>
            <h2 class="font-beccaPerry text-[#676767] text-[44px] mb-[36px]">
              {title}
            </h2>
          </div>

          <div class="flex items-center relative mb-[36px] w-full">
          {types.map((i, index) => (
                <>
                <p class={count >= index
                ? `font-Quicksand bg-[#D6DE23] w-[40px] h-[40px] text-[20px] text-[#F98300] py-[4px] px-[14px] rounded-[50%] font-bold`
                : `text-[#C5C5C5] bg-[#F5F4F1] font-Quicksand w-[40px] h-[40px] text-[20px] py-[4px] px-[14px] rounded-[50%] font-bold`}>{i.ordem}</p>
                {index !== types.length - 1 && (
                <hr class={count >= index
                ? `border-dashed border-b-[1px] w-[80px] border-[#F98300]`
                : `border-dashed border-b-[1px] w-[80px] border-[#C5C5C5]`} />
                )}
                </>
            ))}
          </div>

          <div class="mb-[36px]">
            {types[count] && (
              <div class="flex items-center">
                <p class="font-beccaPerry text-[32px] text-[#FF8300]">
                  Passo {types[count].ordem}:
                </p>
                <p class="font-Quicksand text-[20px] text-[#7E7F88] font-bold ml-[4px]">
                  {types[count].titulo}
                </p>
              </div>
            )}
            <div class="flex overflow-x-scroll max-w-[773px] h-[370px] w-full items-center">
              <div class="flex items-center">
                {count !== types.length -1 && filteredData.map((item) => (
                  <>
                    <div onClick={() => selectPart(item.id, item.id_tipo)} class={IsSelected && selectedId === item.id || idCollection.find((id) => id === item.id)? `flex flex-col items-center w-[138px] h-[237] mr-[4px] bg-[#fff] rounded-[8px] border-[1px] border-[#D6DE23]` : `flex flex-col items-center w-[138px] h-[237] mr-[4px] rounded-[8px] cursor-pointer hover:rounded-[8px] transition duration-300 hover:border-[0.5px] hover:border-[#D6DE23]`}>
                      <img class="" src={item.img_frente} />
                      <p class="font-Quicksand text-[#7E7F88] text-[16px]">{item.nome}</p>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between bg-[#FDF6ED] max-w-[773px] w-full h-[96px] container rounded-[8px]">
            <div class="flex flex-col justify-start w-full">
              <h3 class="font-Quicksand font-bold text-[26px] text-[#676767]">
                Total:{" "}
                <b class="text-[#FF8300]">R$ {price}</b>
              </h3>
              <p class="font-Quicksand text-[#7E7F88]">
                Em até {installments}x R$ {finalValue} sem juros
              </p>
            </div>
            <div class="flex items-center justify-end w-full">
              <button
                onClick={() => clickCount('decrement')}
                class="font-Quicksand text-[#FF8300] mr-[20px] max-w-[198px] w-full h-[44px] bg-[#fff] border-[#FF8300] border-[1px] rounded-[8px]"
              >
                Voltar
              </button>
              <button
                onClick={() => clickCount('increment')}
                class="font-Quicksand text-[#fff] max-w-[198px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]"
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
