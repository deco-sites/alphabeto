import { RichText } from "apps/admin/widgets.ts";
import { useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

/**@title {{ question }}*/
interface DuvidasProps {
/**@title {{ question }}*/
  question: string;
  answer: RichText;
}

interface Perguntas {
  questions: DuvidasProps[];
}

export default function FaqDuvidasFrequentes({ questions }: Perguntas) {
  const [isOpen, setisOpen] = useState(false);

  return (
    <div>
      {questions?.map(({ question, answer }, index) => (
        <div key={index}>
          <button
            class="flex items-center"
            onClick={() => setisOpen(!isOpen)}
          >
            {question}
            <Icon id={`${isOpen ? "minus" : "plus" }`} class="text-[#FF8300]" />
          </button>
          {isOpen &&
            (
              <span>
                <p dangerouslySetInnerHTML={{ __html: answer }} />
              </span>
            )}
        </div>
      ))}
    </div>
  );
}
