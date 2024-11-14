import { Secret } from "apps/website/loaders/secret.ts";
import { type RichText } from "apps/admin/widgets.ts";

import Map from "../../islands/Map.tsx"
import FormsNossasLojas from "site/islands/formsNossasLojas.tsx";

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

export default function NossasLojas({ items, apiKey }: ContentProps) {
    return (
        <div class="flex ml-[40px] mr-[40px] mb-[100px]">
            <section class="w-[100%] pr-[43px]">
                {items.map((content, index) => (
                    <div key={index}>
                        <h2 class="font-[beccaPerry] text-[44px] font-medium text-[#676767] mb-[13px]">{content.title}</h2>
                        <p class="font-regular text-[12px] text-[#ffffff]" dangerouslySetInnerHTML={{ __html: content.paragraph }}/>
                    </div>
                ))}
                <FormsNossasLojas />
            </section>
            <section class="w-full h-[675px]">
                <Map apiKey={apiKey.get()!}/>
            </section>
        </div>
    );
}
