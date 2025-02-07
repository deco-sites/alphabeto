import { AppContext } from "site/apps/deco/vtex.ts";
import type { Document } from "apps/vtex/utils/types.ts";
import { invoke } from "site/runtime.ts";

export type DollParts = {
    id: string;
    img: string;
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

const dollParts = {
    pele: {
        id: "",
        img: "",
    },
    cabelo: {
        id: "",
        img: "",
    },
    face: {
        id: "",
        img: "",
    },
    roupa: {
        id: "",
        img: "",
    },
    acessórios: {
        id: "",
        img: "",
    },
    cheirinho: {
        id: "",
        img: ""
    }
}

const loader = async () => {
    
    const customParts = await invoke.site.loaders.searchDocuments({
        acronym: ACRONYM_PARTS,
        fields: FIELDS_PARTS,
        skip: 0,
        take: 999
      }) as unknown as CustomPart[];
    
    const types = await invoke.site.loaders.searchDocuments({
        acronym: ACRONYM_ORDER,
        fields: FIELDS_ORDER,
        skip: 0,
        take: 999
      }) as unknown as PartType[];

    const order = types.sort((a, b) => a.ordem - b.ordem);
    console.log('Ordem: ', order)

    return order
}

export default loader;