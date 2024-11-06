import Image from "apps/website/components/Image.tsx";
import { Card } from "site/components/footer/Card.tsx";
import {
  Card as CardProps,
  Column as ColumnProps,
  Menu as MenuProps,
  TecnologiesLogo,
} from "site/components/footer/types.ts";

interface Props {
  columns: ColumnProps[];
  card: CardProps;
  tecnologiesLogo: TecnologiesLogo;
}

function Menu(props: MenuProps) {
  const titleContent = props.href
    ? <a href={props.href} target="_blank">{props.title}</a>
    : props.title;

  return (
    <ul class="flex flex-col text-[13px] leading-[19.5px] gap-3">
      <li class="text-primary font-bold mb-2">{titleContent}</li>
      {props.itens.map((item) => (
        <li class="text-base-content hover:text-primary">
          <a href={item.href} target={item.openInNewTab ? "_blank" : "_self"}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Column(props: ColumnProps) {
  return (
    <div>
      <nav class="flex flex-col gap-[50px]">
        {props.menus.map((menu) => <Menu {...menu} />)}
      </nav>
      {props.socialLogos?.length != null && (
        <nav class="flex gap-[10px] mt-8">
          {props.socialLogos.map((socialLogo) => (
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
    </div>
  );
}

export default function MenusAndCardDesktop(props: Props) {
  return (
    <div class="relative">
      <div class="flex items-center justify-between container gap-4 pt-[30px] pb-7 px-10">
        <div class="flex max-w-[871px] w-full justify-between gap-4">
          {props.columns.map((column) => <Column {...column} />)}
        </div>
        <Card {...props.card} />
      </div>
      <div class="flex gap-3 absolute left-[max(40px,_calc(((100vw_-_95rem)_/_2)_+_40px))] bottom-4">
        <a href={props.tecnologiesLogo.econverse.url} target="_blank">
          <Image
            src={props.tecnologiesLogo.econverse.image}
            width={46.86}
            height={14.01}
            alt="Logo da Econverse"
          />
        </a>
        <a href={props.tecnologiesLogo.vtex.url} target="_blank">
          <Image
            src={props.tecnologiesLogo.vtex.image}
            width={34.73}
            height={12.46}
            alt="Logo da VTEX"
          />
        </a>
      </div>
    </div>
  );
}
