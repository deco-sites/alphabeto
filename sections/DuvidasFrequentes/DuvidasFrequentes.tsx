import { RichText } from "apps/admin/widgets.ts";
import FaqDuvidasFrequentes from "../../islands/FaqDuvidasFrequentes.tsx";
import { Section } from "@deco/deco/blocks";

/**@title {{ question }}*/
interface DuvidasProps {
    /**@title Pergunta*/
    question: string;
    /**@title Resposta*/
    answer: RichText;
}

interface Perguntas {
    questions: DuvidasProps[],
    
    Menu: Section;
} 

export default function DuvidasFrequentes({ Menu: { Component: MenuInstitucional, props }, questions }: Perguntas){
    return(
        <div class="container">
            <MenuInstitucional {...props}/>
            <FaqDuvidasFrequentes questions={questions}/>
        </div>
    )
}