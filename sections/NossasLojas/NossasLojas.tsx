import { Secret } from "apps/website/loaders/secret.ts";
import { type RichText } from "apps/admin/widgets.ts";

import Map from "site/islands/Map.tsx";
import FormsNossasLojas from "site/islands/formsNossasLojas.tsx";

import { AppContext } from "site/apps/deco/vtex.ts";
import { query } from "site/sections/NossasLojas/query.ts";

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

export async function loader({ items, apiKey }: ContentProps, _req: Request, ctx: AppContext){
    
    const { io } = await ctx.invoke.vtex.loaders.config()
    // deno-lint-ignore no-explicit-any
    const response = await io.query<any, any>({ 
        variables: {},
        query: query
     })
     console.log(response)

     const stores = response.getStores.items
    return {
        items, apiKey, stores
    }
}

export default function NossasLojas({ items, apiKey, stores }: Awaited<ReturnType<typeof loader>>) {
    return (
        <div class="flex ml-[40px] mr-[40px] mb-[100px]">
            <section class="w-[100%] pr-[43px]">
                {items.map((content, index) => (
                    <div key={index}>
                        <h2 class="font-[beccaPerry] text-[44px] font-medium text-[#676767] mb-[13px]">{content.title}</h2>
                        <p class="font-regular text-[12px] text-[#ffffff]" dangerouslySetInnerHTML={{ __html: content.paragraph }}/>
                    </div>
                ))}
                <FormsNossasLojas stores={stores}/>
            </section>
            <section class="w-full h-[675px]">
                <Map apiKey={apiKey.get()!}/>
            </section>
        </div>
    );
}
