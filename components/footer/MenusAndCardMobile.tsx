import { useScript } from "@deco/deco/hooks";
import Image from "apps/website/components/Image.tsx";
import { Card } from "site/components/footer/Card.tsx";
import {
  Card as CardProps,
  Column as ColumnProps,
  Menu as MenuProps,
} from "site/components/footer/types.ts";
import Icon from "site/components/ui/Icon.tsx";
import { useId } from "site/sdk/useId.ts";

interface Props {
  columns: ColumnProps[];
  card: CardProps;
}

export interface ExtendedMenuProps extends MenuProps {
  id: string;
}

const handleToogle = (menus: ExtendedMenuProps[]) => {
  menus.map((menu) => {
    const menuElement = document.getElementById(menu.id);
    if (!menuElement) return;
    const button = menuElement.querySelector("button");

    const itens = menuElement.querySelector("ul");
    if (!itens || !button) return;

    button.addEventListener("click", () => {
      const visibleIcon = menuElement.querySelector(".block");
      const hiddenIcon = menuElement.querySelector(".hidden");
      if (!visibleIcon || !hiddenIcon) return;
      const operation = itens.style.height === "0px" ? "open" : "close";
      visibleIcon.classList.remove("block");
      visibleIcon.classList.add("hidden");

      hiddenIcon.classList.add("block");
      hiddenIcon.classList.remove("hidden");

      if (operation === "close") {
        itens.style.height = "0px";
      } else {
        itens.style.height = itens.scrollHeight + "px";
      }
    });
    const link = button.querySelector("a");
    if (!link) return;
    link.addEventListener("click", (ev) => ev.stopPropagation());
  });
};

function Menu(props: ExtendedMenuProps) {
  const titleContent = props.href
    ? (
      <a
        class="text-[13px] leading-[19.5px] font-bold text-primary"
        href={props.href}
        target="_blank"
      >
        {props.title}
      </a>
    )
    : (
      <span class="text-[13px] leading-[19.5px] font-bold text-primary">
        {props.title}
      </span>
    );

  return (
    <nav class="mb-4 border-b border-dashed border-secondary" id={props.id}>
      <button class="flex justify-between mb-4 w-full">
        {titleContent}
        <div class="text-[#D6DE23] ">
          <Icon class="block" id="plus" size={20} />
          <Icon class="hidden" id="minus" size={20} />
        </div>
      </button>

      <ul
        class="flex flex-col text-[12px] leading-[18px] gap-4 transition-[height] duration-200 ease-linear overflow-hidden"
        style={{ height: 0 }}
      >
        {props.itens.map((item) => (
          <li class="text-[#676767] hover:text-primary first:mt-1 last:mb-4">
            <a href={item.href} target={item.openInNewTab ? "_blank" : "_self"}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function MenusAndCardMobile(props: Props) {
  const allMenus = props.columns.map((column) => column.menus).flat().map(
    (menu) => ({
      ...menu,
      id: useId(),
    }),
  );
  const allSocialLogos = props.columns.map((column) => column.socialLogos ?? [])
    .flat();

  return (
    <div class="container pt-5 pb-[9px]">
      <Card {...props.card} />
      {allSocialLogos.length != null && (
        <nav class="flex gap-[10px] mt-[22px] justify-center">
          {allSocialLogos.map((socialLogo) => (
            <a href={socialLogo.url} target="_blank" class="block w-5 h-5">
              <Image
                src={socialLogo.logo}
                width={20}
                height={20}
                alt={`Logo da Rede Social: ${socialLogo.title}`}
              />
            </a>
          ))}
        </nav>
      )}

      <div class="mt-[30px]">
        {allMenus.map((menu) => <Menu {...menu} />)}
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: useScript(handleToogle, allMenus),
          }}
        />
      </div>
    </div>
  );
}
