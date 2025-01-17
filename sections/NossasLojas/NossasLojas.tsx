// deno-lint-ignore-file
import { type RichText } from "apps/admin/widgets.ts";
import { Secret } from "apps/website/loaders/secret.ts";

import Map from "site/islands/Map.tsx";
import FormsNossasLojas from "site/islands/formsNossasLojas.tsx";

import { AppContext } from "site/apps/deco/vtex.ts";
import { query } from "site/sections/NossasLojas/query.ts";
import { Data } from "./types.ts";

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
