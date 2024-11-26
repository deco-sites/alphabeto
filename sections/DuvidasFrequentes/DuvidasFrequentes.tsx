import { RichText } from "apps/admin/widgets.ts";
import FaqDuvidasFrequentes from "../../islands/FaqDuvidasFrequentes.tsx";

/**@title {{ question }}*/
interface DuvidasProps {
    /**@title Pergunta*/
    question: string;
    /**@title Resposta*/
    answer: RichText;
}

interface Perguntas {
    questions: DuvidasProps[],
    title: string,
    paragraph: RichText
} 

export default function DuvidasFrequentes({ questions, title, paragraph }: Perguntas){
    return(
        <div>
            <div>
                <h1>{title}</h1>
                <p dangerouslySetInnerHTML={{ __html: paragraph }}/>
            </div>
            <FaqDuvidasFrequentes questions={questions}/>
        </div>
    )
}