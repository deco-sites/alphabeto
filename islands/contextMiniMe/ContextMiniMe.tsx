//import React from "preact/compat";

import { invoke } from "site/runtime.ts";

//const MyContext = React.createContext('')

export type CustomPart = {
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
};

export type PartType = {
  id: string;
  nome: string;
  titulo: string;
  ordem: number;
  ativo: boolean;
};

export async function LoaderMiniMe() {
  const response = await invoke.site.loaders.searchDocuments({
    acronym: "PC",
    fields: "nome,id,gender,id_tipo,ativo,img_frente,img_costas,img_frente_alta,img_costas_alta,img_costas_special,img_frente_special,img_frente_special_hand,img_costas_special_hand,oculto&_where=ativo=true",
    skip: 0,
    take: 999
  }) as unknown as CustomPart[];

  return response;
}

export async function LoaderMiniMeTypes() {
  const typeResponse = await invoke.site.loaders.searchDocuments({
    acronym: "TP",
    fields: "id,nome,ordem,titulo&_where=ativo=true",
    skip: 0,
    take: 999
  }) as unknown as PartType[];

  return typeResponse;
}