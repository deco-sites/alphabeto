// deno-lint-ignore-file
import { type RichText } from "apps/admin/widgets.ts";
import { Secret } from "apps/website/loaders/secret.ts";

import FormsNossasLojas from "site/islands/FormsNossasLojas.tsx";
import Map from "site/islands/Map.tsx";

import { AppContext } from "site/apps/deco/vtex.ts";
import { query } from "site/sections/NossasLojas/query.ts";
import { Data } from "site/sections/NossasLojas/types.ts";

/**@title Conteúdo*/
interface NossasLojasProps {
  /**@title Título na página*/
  title?: string;
  /**@title Parágrafo*/
  paragraph: RichText;
}

interface ContentProps {
  /**@title Itens*/
  items: NossasLojasProps[];

  apiKey: Secret;
}

interface MasterDataResponse {
  store_id: string;
  whatsapp: string;
}

const statesToNames = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export async function loader(
  { items, apiKey }: ContentProps,
  _req: Request,
  ctx: AppContext,
) {
  // @deno-ignore
  const masterdataStoreNumbers = await ctx.invoke.site.loaders.searchDocuments({
    acronym: "SM",
    fields: "store_id,whatsapp",
    take: 500,
  }) as unknown as MasterDataResponse[];

  const { io } = await ctx.invoke.vtex.loaders.config();

  const response = await io.query<Data, {}>({
    variables: {},
    query: query,
  });

  const stores = response.getStores.items.map((item) => {
    const storeNumber = masterdataStoreNumbers.find((storeNumber) =>
      storeNumber.store_id === item.id
    );
    return {
      ...item,
      stateName:
        statesToNames[item.address.state as keyof typeof statesToNames],
      whatsapp: storeNumber?.whatsapp,
    };
  });
  return {
    items,
    apiKey,
    stores,
  };
}

export default function NossasLojas(
  { items, apiKey, stores }: Awaited<ReturnType<typeof loader>>,
) {
  return (
    <div class="flex mobile:flex-col container mb-[100px]">
      <section class="w-[100%] pr-[43px] mobile:pr-0">
        {items.map((content, index) => (
          <div key={index}>
            <h2 class="font-[beccaPerry] text-[44px] mobile:text-[32px] text-left font-medium text-accent mb-[13px]">
              {content.title}
            </h2>
            <p
              class="font-regular text-[12px] text-[#ffffff]"
              dangerouslySetInnerHTML={{ __html: content.paragraph }}
            />
          </div>
        ))}
        <FormsNossasLojas stores={stores} />
      </section>
      <section class="w-full h-[675px]">
        <Map apiKey={apiKey.get()!} stores={stores} />
      </section>
    </div>
  );
}
