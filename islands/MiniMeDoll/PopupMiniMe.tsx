import { CustomPart } from "site/islands/contextMiniMe/ContextMiniMe.tsx";
import { useState } from "preact/hooks";

interface Props {
  title?: string;

  dollParts: CustomPart[];
}

export default function PopupMiniMe({ title, dollParts }: Props) {
  const [doll, setDoll] = useState<CustomPart[]>([]);
  setDoll(dollParts);

  const types = [
    "Corpinho",
    "Cabelinho",
    "Rostinho",
    "Lookinho",
    "Jeitinho",
    "Cheirinho",
  ];

  return (
    <>
      <section class="absolute">
        <section>
            <img src="" alt="" />
          <div>
            <h2>Uaaaaau!{title}</h2>
            <div class="flex flex-col">
              {doll.map((doll, index) => (
                  <p key={index}>{types[index]}: {doll.nome}</p>
              ))}
            </div>
          </div>
          <div>
            
          </div>
        </section>
      </section>
    </>
  );
}
