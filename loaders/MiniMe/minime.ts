import { AppContext } from "site/apps/deco/vtex.ts";

export type DollTypes = Record<string, DollParts[]>;

interface DollParts {
    id: string;
    id_tipo: string;
    img_frente: string;
    img_costas: string;
    oculto: boolean;
}

type CustomPart = {
    id: string;
    // gender: string | undefined | null;
    nome: string;
    id_tipo: string;
    img_frente: string;
    img_costas: string;
    img_frente_special: string;
    img_costas_special: string;
    img_frente_special_hand: string;
    img_costas_special_hand: string;
    img_frente_alta: string;
    img_costas_alta: string;
    ativo: boolean;
    oculto: boolean;
}

type PartType = {
    id: string;
    nome: string;
    titulo: string;
    ordem: number;
    ativo: boolean;
};

const FIELDS_PARTS = `nome,id,gender,id_tipo,ativo,img_frente,img_costas,img_frente_alta,img_costas_alta,img_costas_special,img_frente_special,img_frente_special_hand,img_costas_special_hand,oculto&_where=ativo=true`;
const ACRONYM_PARTS = `PC`;

const FIELDS_ORDER = "id,nome,ordem,titulo&_where=ativo=true";
const ACRONYM_ORDER = `TP`;


const loader = async (
    _props: DollParts,
    _req: Request,
    ctx: AppContext
): Promise<DollTypes> => {
    const customParts = await ctx.invoke.site.loaders.searchDocuments({
        acronym: ACRONYM_PARTS,
        fields: FIELDS_PARTS,
        skip: 0,
        take: 999
      }) as unknown as CustomPart[];
    
    const types = await ctx.invoke.site.loaders.searchDocuments({
        acronym: ACRONYM_ORDER,
        fields: FIELDS_ORDER,
        skip: 0,
        take: 999
      }) as unknown as PartType[];

      console.log("types: ", types)
    const order = [...types].sort((a, b) => a.ordem - b.ordem);
    const dollParts:Record<string, DollParts[]> = order.reduce((acc, item) => {
        acc[item.nome] = []
        return acc
    }, {} as Record<string, DollParts[]>)

    customParts.forEach((part) => {
        switch(Number(part.id_tipo)){
            case 5:
                dollParts["pele"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            case 4:
                dollParts["cabelo"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            case 6:
                dollParts["face"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            case 7:
                dollParts["roupa"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            case 11:
                dollParts["acessórios"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            case 8:
                dollParts["cheirinho"].push({
                    id: part.id,
                    id_tipo: part.id_tipo,
                    img_frente: part.img_frente,
                    img_costas: part.img_costas,
                    oculto: part.oculto,
                })
            break;
            default:
        }
    })

    return Object.fromEntries(
        Object.entries(dollParts).filter(([key]) => key !== "genero")
    );
}

export default loader;