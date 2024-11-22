import { RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";

interface DuvidasProps {
    question: string;
    answer: RichText;
}

interface Perguntas {
    questions: DuvidasProps[]
} 

export default function DuvidasFrequentes({ questions }: Perguntas){
    return(
        <div>
            {questions?.map(({ question, answer }, index) => (
                    <div key={index}>
                        <span class="flex items-center">
                            {question}
                            <Icon id="plus" class="text-[#FF8300]"/>
                        </span>
                        <span>
                        <p dangerouslySetInnerHTML={{  __html: answer }}/>
                        </span>
                    </div>
                ))
            }
        </div>
    )
}