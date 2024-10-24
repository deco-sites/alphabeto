import { useDevice } from "@deco/deco/hooks";
import { Suggestion } from "apps/commerce/types.ts";
import { createArrayGroups } from "../../../sdk/arrayUtils.ts";
import { clx } from "../../../sdk/clx.ts";
import { ACTION, NAME } from "./Form.tsx";

export interface Props {
  suggestion: Suggestion;
  mostSellerTerms: string[];
}

function TopSearchsDesktop({ suggestion, mostSellerTerms }: Props) {
  const { searches = [] } = suggestion ?? {};
  const hasTerms = Boolean(searches.length);
  return (
    <div class={clx(`flex gap-[62px] pb-[54px]`, !hasTerms && "hidden")}>
      <div class="flex flex-col gap-5 pr-[13px]">
        <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
          Mais Procurados
        </span>
        <ul class="flex flex-col gap-3 max-h-[148px] flex-wrap">
          {searches.map(({ term }) => (
            <li class="block">
              {/* TODO @gimenes: use name and action from searchbar form */}
              <a href={`${ACTION}?${NAME}=${term}`} class="block">
                <span dangerouslySetInnerHTML={{ __html: term }} class="block text-accent text-[13px] leading-[19.5px] font-medium capitalize hover:text-primary min-w-[158px] pr-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div class="flex flex-col gap-5 pr-[13px]">
        <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
          Mais Vendidos
        </span>
        <ul class="flex flex-col gap-3 max-h-[148px] flex-wrap">
          {mostSellerTerms.map((term) => (
            <li class="block">
              {/* TODO @gimenes: use name and action from searchbar form */}
              <a href={`${ACTION}?${NAME}=${term}`} class="block">
                <span dangerouslySetInnerHTML={{ __html: term }} class="block text-accent text-[13px] leading-[19.5px] font-medium capitalize hover:text-primary min-w-[158px] pr-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TopSearchsMobile({ suggestion, mostSellerTerms }: Props) {
  const { searches = [] } = suggestion ?? {};
  const hasTerms = Boolean(searches.length);

  interface ListItem {
    content: string;
    hightlight: boolean;
  }

  const listData: ListItem[] = searches.map(({ term }) => ({ content: term, hightlight: false }));
  const titleItem: ListItem = { content: "Mais Vendidos", hightlight: true };
  listData.push(titleItem, ...mostSellerTerms.map((term) => ({ content: term, hightlight: false })));

  const columns = createArrayGroups(listData, 2);

  return (
    <div class={clx(`flex flex-col gap-5 pb-[34px]`, !hasTerms && "hidden")}>
      <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
        Mais Procurados
      </span>
      <div className="flex justify-between">
        {columns.map((column, index) => (
          <ul key={index} class="flex flex-col gap-3 min-w-[133px]">
            {column.map(({ content, hightlight }) => {
              if (hightlight)
                return (
                  <li class="block pt-4 pb-2">
                    <span dangerouslySetInnerHTML={{ __html: content }} class="block text-primary text-[13px] leading-[19.5px] font-bold capitalize min-w-[133px] pr-[18px]" />
                  </li>
                );
              return (
                <li class="block">
                  {/* TODO @gimenes: use name and action from searchbar form */}
                  <a href={`${ACTION}?${NAME}=${content}`} class="block">
                    <span dangerouslySetInnerHTML={{ __html: content }} class="block text-accent text-[13px] leading-[19.5px] font-medium capitalize hover:text-primary min-w-[133px] pr-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function TopSearchs(props: Props) {
  const device = useDevice();
  if (device === "desktop") return <TopSearchsDesktop {...props} />;
  else return <TopSearchsMobile {...props} />;
}
