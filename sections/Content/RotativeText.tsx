import { useScriptAsDataURI } from "@deco/deco/hooks";
import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";
import { useId } from "site/sdk/useId.ts";

export type RotativeTextContent = string | null;

interface Props {
  text: RotativeTextContent;
}

type Item =
  | {
    type: "icon";
    icon: AvailableIcons;
    color: string;
  }
  | {
    type: "text";
    text: string;
    color: string;
  };

const ITEMS_QTD = 10;
const COLORS = ["#FF8300", "#70D1E8", "#D6DE23", "#FF859A"];
const ICONS: AvailableIcons[] = [
  "rotative_sum",
  "rotative_star",
  "rotative_moon",
];

const rotate = (id: string) => {
  globalThis.addEventListener("load", () => {
    const bar = document.getElementById(id);
    if (!bar) return;
    const VELOCITY = 2;
    let currentTranslate = 0;
    let direction = 1; // 1 para frente, -1 para trás

    const maxTranslate = bar.scrollWidth - bar.clientWidth + 10;

    const animate = () => {
      currentTranslate += VELOCITY * direction;
      if (currentTranslate >= maxTranslate) {
        currentTranslate = maxTranslate;
        direction *= -1; // Inverte a direção
      } else if (currentTranslate <= 0) {
        currentTranslate = 0;
        direction *= -1; // Inverte a direção
      }
      bar.style.transform = `translateX(-${currentTranslate}px)`;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
};

export default function RotativeText({ text }: Props) {
  if (!text) return null;
  let colorPos = -1;
  const id = useId();
  const items: Item[] = Array.from({ length: ITEMS_QTD }, (_, index) => {
    const isIcon = index % 2 === 0;
    if (colorPos === COLORS.length - 1) colorPos = -1;
    const color = COLORS[++colorPos];
    return isIcon
      ? { type: "icon", icon: ICONS[index % ICONS.length], color }
      : { type: "text", text: text, color };
  });
  return (
    <div class="max-w-[100vw] overflow-hidden">
      <div class="whitespace-nowrap  no-scrollbar flex gap-12 my-8" id={id}>
        {items.map((item, index) => {
          if (item.type === "icon") {
            return (
              <Icon
                size={48}
                class="min-w-12"
                key={index}
                id={item.icon}
                style={{ color: item.color }}
              />
            );
          }
          return (
            <span
              class="font-beccaPerry font-medium text-[40px] leading-[48px]"
              key={index}
              style={{ color: item.color }}
            >
              {item.text}
            </span>
          );
        })}
        <script src={useScriptAsDataURI(rotate, id)} />
      </div>
    </div>
  );
}
