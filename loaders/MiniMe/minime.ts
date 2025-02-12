import { AppContext } from "site/apps/deco/vtex.ts";

export interface MiniMe {
  types: PartType[];
  parts: Record<string, Parts[]>;
}

interface Parts {
  id: string;
  id_tipo: string;
  img_frente: string;
  img_costas: string;
  oculto: boolean;
}

type CustomPart = {
  id: string;
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

type PartType = {
  id: string;
  nome: string;
  titulo: string;
  ordem: number;
  ativo: boolean;
};

const FIELDS_PARTS =
  `nome,id,id_tipo,ativo,img_frente,img_costas,img_frente_alta,img_costas_alta,img_costas_special,img_frente_special,img_frente_special_hand,img_costas_special_hand,oculto&_where=ativo=true`;
const ACRONYM_PARTS = `PC`;

const FIELDS_ORDER = "id,nome,ordem,titulo&_where=ativo=true";
const ACRONYM_ORDER = `TP`;

const loader = async (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<MiniMe> => {
  const customParts = await ctx.invoke.site.loaders.searchDocuments({
    acronym: ACRONYM_PARTS,
    fields: FIELDS_PARTS,
    skip: 0,
    take: 999,
  }) as unknown as CustomPart[];

  const types = await ctx.invoke.site.loaders.searchDocuments({
    acronym: ACRONYM_ORDER,
    fields: FIELDS_ORDER,
    skip: 0,
    take: 999,
  }) as unknown as PartType[];

  const order = [...types].sort((a, b) => a.ordem - b.ordem);
  const dollParts: MiniMe = order.reduce((acc, item) => {
    acc.parts[item.nome] = [];
    return acc;
  }, { types: [], parts: {} });

  dollParts.types = order;

  customParts.forEach((part) => {
    const name = order.find((item) => Number(part.id_tipo) === Number(item.id))
      ?.nome;

    if(name){
      dollParts.parts[name].push({
      id: part.id,
      id_tipo: part.id_tipo,
      img_frente: part.img_frente,
      img_costas: part.img_costas,
      oculto: part.oculto,
    });
  }
  });


  return dollParts;
};

export default loader;
