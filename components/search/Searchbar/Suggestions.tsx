import { type Resolved } from "@deco/deco";
import { Suggestion } from "apps/commerce/types.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import { ACTION, NAME } from "./Form.tsx";
import ProductCardSearch from "./ProductCardSearch.tsx";
export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
}
export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const {
    loader: { __resolveType, ...loaderProps },
  } = props;
  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = (await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  })) as Suggestion | null;
  return { suggestion };
};
export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const {
    loader: { __resolveType, ...loaderProps },
  } = props;
  const query = new URL(req.url).searchParams.get(NAME ?? "q");
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = (await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  })) as Suggestion | null;
  return { suggestion };
};
function Suggestions({ suggestion }: ComponentProps<typeof loader, typeof action>) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products.length);
  const hasTerms = Boolean(searches.length);
  return (
    <div class={clx(`overflow-y-scroll`, !hasProducts && !hasTerms && "hidden")}>
      <div class="gap-11 grid grid-cols-[185px_1fr]">
        <div class="flex flex-col gap-5 border-r border-dashed border-secundary">
          <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
            Sugestões
          </span>
          <ul class="flex flex-col gap-3">
            {searches.map(({ term }) => (
              <li>
                {/* TODO @gimenes: use name and action from searchbar form */}
                <a href={`${ACTION}?${NAME}=${term}`}>
                  <span dangerouslySetInnerHTML={{ __html: term }} class="text-accent text-[13px] leading-[19.5px] font-medium capitalize hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div class="flex flex-col gap-5 overflow-hidden">
          <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
            Produtos sugeridos
          </span>
          <ul class="grid grid-cols-2 w-fit gap-y-[25px] gap-x-[57px]">{products ? products.map((product, index) => <ProductCardSearch product={product} index={index} itemListName="Suggeestions" />) : null}</ul>
        </div>
      </div>
    </div>
  );
}
export default Suggestions;
