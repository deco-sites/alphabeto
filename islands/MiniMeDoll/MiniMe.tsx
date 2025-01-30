import { LoaderMiniMe } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import { LoaderMiniMeTypes } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import type { CustomPart } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import type { PartType } from "site/islands/contextMiniMe/ContextMiniMe.tsx";

import Image from "apps/website/components/Image.tsx";

import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";

import { ImageWidget } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";

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
  //Estados para coleta de dados (imagens da boneca)
  const [data, setData] = useState<CustomPart[]>([]);
  const [types, setTypes] = useState<PartType[]>([]);
  const [filteredData, setFilteredData] = useState<CustomPart[]>([]);

  // IdCollection serve para salvar os ids dos itens selecionados
  // dollParts é o array principal onde as partes selecionadas são guardadas
  const [idCollection, setIdCollection] = useState<string[] | []>([]);
  const [dollParts, setDollParts] = useState<CustomPart[]>([]);

  // Estado para efetuar a ação de virada da boneca
  const [isDollTurned, setIsDollTurned] = useState(false);

  // Determinar se os itens selecionados ainda estão selecionados e quais IDs estão selecionados
  const [isSelected, setIsSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Valor final da Mini Me
  const [finalValue, setFinalValue] = useState("");
  //contador para saber as etapas
  const [count, setCount] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollQtd = 250;

  const scrollItems = (side: string) => {
    if (scrollContainerRef.current) {
      if (side === "left") {
        scrollContainerRef.current.scrollBy({
          left: -scrollQtd,
          behavior: "smooth",
        });
      } else if (side === "right") {
        scrollContainerRef.current.scrollBy({
          left: +scrollQtd,
          behavior: "smooth",
        });
      }
    }
  };

  // Função principal para puxar os dados do ContextMiniMe.tsx
  // Função também retorna o array types organizado do menor para o maior,
  // ou melhor, na ordem de primeiro ao último
  const fetchData = async () => {
    const data = await LoaderMiniMe();
    setData(data);
    const typeSequence = await LoaderMiniMeTypes();
    const typesSorted = [...typeSequence].sort((a, b) => a.ordem - b.ordem);
    setTypes(typesSorted);
  };

  // Função que filtra os dados após determinado passo selecionado, por exemplo:
  // Passo 2 irá gerar as imagens que estão na 2º posição na ordem do array types
  const filterData = (i: number) => {
    localStorage.setItem("types", JSON.stringify(types));

    let tempData: StateUpdater<CustomPart[]> = [];
    const typesStorage: PartType[] = JSON.parse(
      localStorage.getItem("types") || "[]",
    );

    // Elemento dinâmico para que a geração não fique estática dependente de ifs e cases
    // há apenas um if para verificar se o typesStorage possui algum dado.
    if (typesStorage[i]) {
      tempData = data.filter((item) =>
        parseInt(item.id_tipo) === parseInt(typesStorage[i].id)
      );
      tempData = [...tempData].sort((a, b) =>
        parseInt(a.nome) - parseInt(b.nome)
      );
      setFilteredData(tempData);
    }
  };

  // Dependendo do botão selecionado, 'voltar' ou 'avançar',
  // a função abaixo determina se sobe ou desce os passos
  const clickCount = (operation: string) => {
    let i = 0;

    if (operation === "increment" && count < 6) {
      i = count + 1;
    } else if (operation === "decrement" && count > 0) {
      i = count - 1;
    }

    localStorage.setItem("count", JSON.stringify(i));
    setCount(i);
    filterData(i);
  };

  // Função que seleciona as partes selecionadas e as guarda em dollParts
  const selectPart = (id: string, id_type: string) => {
    const typesStorage: PartType[] = JSON.parse(
      localStorage.getItem("types") || "[]",
    );

    // Organiza os arrays para que o dollParts seja conforme os passos, por exemplo:
    // index 0: possui apenas informações sobre a pele selecionada
    // index 1: possui apenas informações sobre o cabelo da boneca e assim por diante
    const typeOfIndex = typesStorage.reduce((map, type, index) => {
      map[parseInt(type.id)] = index;
      return map;
    }, {} as Record<number, number>);

    const index = typeOfIndex[parseInt(id_type)];

    const parts = JSON.parse(localStorage.getItem("parts") || "[]");
    const identifications = JSON.parse(localStorage.getItem("ids") || "[]");

    if (parts[index] !== id) {
      const ids = [...identifications];
      const updateParts = [...parts];

      // Remove o item selecionado
      if (selectedId === id) {
        updateParts[index] = "";
        setDollParts(updateParts);
        setIdCollection(ids);
        setSelectedId(id);
        setIsSelected(false);
      } else {
        // adiciona item selecionado
        const selectedImage = filteredData.find((item) => item.id === id);
        if (selectedImage) {
          ids[index] = selectedImage.id;
          updateParts[index] = selectedImage;
          setDollParts(updateParts);
          setIdCollection(ids);
          setSelectedId(id);
          setIsSelected(true);
        }
      }

      localStorage.setItem("parts", JSON.stringify(updateParts));
      localStorage.setItem("ids", JSON.stringify(ids));
    }
  };

  // Atualiza as informações de partes selecionadas, passo parado e ids selecionados caso haja um refresh na tela
  const updateDoll = () => {
    const parts = JSON.parse(localStorage.getItem("parts") || "[]");
    setDollParts(parts);

    const i = JSON.parse(localStorage.getItem("count") || "");
    setCount(i);

    const ids = JSON.parse(localStorage.getItem("ids") || "[]");
    setIdCollection(ids);
  };

  // Altera as imagens da boneca para que ela fique de costas
  const turnDoll = () => {
    if (isDollTurned === true) {
      setIsDollTurned(false);
    } else {
      setIsDollTurned(true);
    }
  };

  // Exclui todos os componentes da boneca
  const deleteDoll = () => {
    localStorage.removeItem("parts");
    localStorage.removeItem("count");
    localStorage.removeItem("ids");
    setCount(0);
    filterData(0);
    updateDoll();
  };

  // Primeira renderização para puxar as primeiras informações
  useEffect(() => {
    fetchData();
    updateDoll();
    if (installments > 1) {
      const value = price / installments;
      const formatedValue = JSON.stringify(value).replace(/\./g, ",");
      setFinalValue(formatedValue);
    }
  }, []);

  // Atualiza as informações caso não haja atualização nos arrays utilizados na lógica
  useEffect(() => {
    if (data.length > 0) {
      if (filteredData.length === 0) {
        const i = JSON.parse(localStorage.getItem("count") || "0");
        filterData(i);
      }
    }
  }, [data, types, count]);

  // Se não houver nenhum tipo de dado é retornado um valor nulo
  if (!data || !types) return null;

  return (
    <>
      <section class="mobile:relative container flex mobile:flex-col-reverse max-w-[1360px] w-full mb-[100px]">
        <section class="relative mr-[30px] mobile:mb-[120px] px-[55px] py-[33px] mobile:px-[30px] mobile:py-[15px] bg-[#fff] border-dashed border-[1px] border-[#FF3800] rounded-[8px] max-w-[557px] h-[835px] mobile:h-[520px] w-full">
          <button
            onClick={turnDoll}
            class="absolute top-[15px] right-[15px] w-[50px] h-[60px] p-[8px] bg-[#F7E0BF] rounded-[8px]"
          >
            <div class="flex flex-col items-center font-Quicksand text-[12px] text-[#FF8300] font-bold">
              <Icon id="turn-doll" />Virar
            </div>
          </button>
          <button
            onClick={deleteDoll}
            class="absolute top-[100px] right-[15px] w-[50px] h-[60px] p-[8px] bg-[#F5F4F1] rounded-[8px]"
          >
            <div class="flex flex-col items-center font-Quicksand text-[12px] text-[#676767] font-bold">
              <Icon id="delete-doll" />Excluir
            </div>
          </button>
          {dollParts.some((part) => part)
            ? (
              dollParts.map((part, index) =>
                part
                  ? (
                    <Image
                      key={index}
                      src={isDollTurned === true
                        ? part.img_costas === null
                          ? part.img_frente
                          : part.img_costas
                        : part.img_frente}
                      width={446}
                      height={669}
                      class={`absolute mobile:top-0 mobile:left-0
                        ${
                        part.id === "44" && isDollTurned === false
                          ? ""
                          : `z-[10]`
                      } 
                        ${
                        part.oculto === true
                          ? "hidden"
                          : parseInt(part.id_tipo) === 8
                          ? "hidden"
                          : part.img_costas === null && isDollTurned === true
                          ? "hidden"
                          : ""
                      }
                      `}
                    />
                  )
                  : null
              )
            )
            : (
              <Image
                src={image}
                width={446}
                height={669}
              />
            )}
        </section>

        <div class="relative max-w-[773px] w-full h-[735px] mobile:h-[450px]">
          <div>
            <h2 class="font-beccaPerry text-[#676767] text-[44px] mobile:text-[32px] mb-[36px]">
              {title}
            </h2>
          </div>

          <div class="flex items-center relative mb-[36px] w-full">
            {types.map((i, index) => (
              <>
                <p
                  class={count >= index
                    ? `font-Quicksand bg-[#D6DE23] w-[40px] h-[40px] text-[20px] text-[#F98300] py-[4px] px-[14px] rounded-[50%] font-bold`
                    : `text-[#C5C5C5] bg-[#F5F4F1] font-Quicksand w-[40px] h-[40px] text-[20px] py-[4px] px-[14px] rounded-[50%] font-bold`}
                >
                  {i.ordem}
                </p>
                {index !== types.length - 1 && (
                  <hr
                    class={count >= index
                      ? `border-dashed border-b-[1px] w-[80px] border-[#F98300]`
                      : `border-dashed border-b-[1px] w-[80px] border-[#C5C5C5]`}
                  />
                )}
              </>
            ))}
          </div>

          <div class="mb-[36px]">
            {types[count] && (
              <div class="flex items-center">
                <p class="font-beccaPerry text-[32px] mobile:text-[25px] text-[#FF8300]">
                  Passo {types[count].ordem}:
                </p>
                <p class="font-Quicksand text-[20px] mobile:text-[16px] text-[#7E7F88] font-bold ml-[4px]">
                  {types[count].titulo}
                </p>
              </div>
            )}
            <div
              ref={scrollContainerRef}
              class="flex mobile:overflow-scroll overflow-hidden max-w-[773px] h-[370px] mobile:h-[232px] w-full items-center"
            >
              <div class="flex items-center">
                {count !== types.length - 1 && filteredData.map((item) => (
                  <>
                    <div
                      onClick={() => selectPart(item.id, item.id_tipo)}
                      class={isSelected && selectedId === item.id ||
                          idCollection.find((id) => id === item.id)
                        ? `flex flex-col items-center w-[138px] h-[237] mr-[4px] bg-[#fff] rounded-[8px] border-[1px] border-[#D6DE23]`
                        : `flex flex-col items-center w-[138px] h-[237] mr-[4px] rounded-[8px] cursor-pointer hover:rounded-[8px] transition duration-300 hover:border-[0.5px] hover:border-[#D6DE23]`}
                    >
                      <img class="mobile:w-[97px] mobile:h-[158px]" src={item.img_frente} />
                      <p class="font-Quicksand text-[#7E7F88] text-[16px] mobile:text-[12px] text-center">
                        {item.nome}
                      </p>
                    </div>
                  </>
                ))}
              </div>
            </div>
            <button
              onClick={() => scrollItems("left")}
              class="flex items-center justify-center absolute mobile:bottom-[50px] left-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full rotate-[180deg] p-[12px]"
            >
              <Icon id="simple-arrow-right"  />
            </button>
            <button
              onClick={() => scrollItems("right")}
              class="flex items-center justify-center absolute mobile:bottom-[50px] right-0 z-10 bg-[#fff] mobile:bg-transparent mobile:shadow-none shadow-[0_0_4px_1px_rgba(0,0,0,0.5)] rounded-full p-[12px]"
            >
              <Icon id="simple-arrow-right"  />
            </button>
          </div>

          <div class="mobile:absolute mobile:top-[925px] mt-[80px] flex mobile:flex-col mobile:justify-center items-center justify-between bg-[#FDF6ED] max-w-[773px] w-full h-[96px] mobile:h-[149px] container rounded-[8px]">
            <div class="flex flex-col mobile:items-center justify-start mobile:justify-center w-full mobile:mb-[20px]">
              <h3 class="font-Quicksand font-bold text-[26px] mobile:text-[18px] text-[#676767]">
                Total: <b class="text-[#FF8300]">R$ {price}</b>
              </h3>
              <p class="font-Quicksand text-[#7E7F88] mobile:text-[12px]">
                Em até {installments}x R$ {finalValue} sem juros
              </p>
            </div>
            <div class="flex items-center justify-end w-full">
              <button
                onClick={() => clickCount("decrement")}
                class="font-Quicksand text-[#FF8300] mr-[20px] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#fff] border-[#FF8300] border-[1px] rounded-[8px]"
              >
                Voltar
              </button>
              <button
                onClick={() => clickCount("increment")}
                class="font-Quicksand text-[#fff] max-w-[198px] mobile:max-w-[140px] w-full h-[44px] bg-[#FF8300] border-[#FF8300] border-[1px] rounded-[8px]"
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
