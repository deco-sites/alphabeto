import { Suggestion } from "apps/commerce/types.ts";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import ProductCard from "../../product/ProductCard.tsx";
import Slider from "../../ui/Slider.tsx";
import { ACTION, NAME } from "./Form.tsx";
import { type Resolved } from "@deco/deco";
export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;
}
export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};
export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { loader: { __resolveType, ...loaderProps } } = props;
  const query = new URL(req.url).searchParams.get(NAME ?? "q");
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  }) as Suggestion | null;
  return { suggestion };
};
function Suggestions(
  { suggestion }: ComponentProps<typeof loader, typeof action>,
) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products.length);
  const hasTerms = Boolean(searches.length);
  return (
    <div
      class={clx(`overflow-y-scroll`, !hasProducts && !hasTerms && "hidden")}
    >
      <div class="gap-4 grid grid-cols-[230px_1fr]">
        <div class="flex flex-col gap-6">
          <span class="font-bold text-[13px] text-primary" role="heading" aria-level={3}>
            Sugestões
          </span>
          <ul class="flex flex-col gap-3">
            {searches.map(({ term }) => (
              <li>
                {/* TODO @gimenes: use name and action from searchbar form */}
                <a
                  href={`${ACTION}?${NAME}=${term}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: term }} class="text-accent text-[13px] font-medium capitalize" />
                </a>
              </li>
            ))}
          </ul>
        </div>


        <div class="flex flex-col gap-[22px] overflow-hidden">
          <span class="font-bold text-[13px] text-primary" role="heading" aria-level={3}>
            Produtos sugeridos
          </span>
          <Slider class="carousel grid grid-cols-2 w-fit gap-6">
            {products.map((product, index) => (
              <Slider.Item
                index={index}
                class="carousel-item first:ml-4 last:mr-4 min-w-[200px] max-w-[200px]"
              >
                <ProductCard
                  product={product}
                  index={index}
                  itemListName="Suggeestions"
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
export default Suggestions;
