import { type Resolved } from "@deco/deco";
import { Suggestion } from "apps/commerce/types.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import type { AppContext } from "../../../apps/site.ts";
import { clx } from "../../../sdk/clx.ts";
import { ComponentProps } from "../../../sections/Component.tsx";
import { ACTION, NAME } from "./Form.tsx";
import RenderProductsResults from "./RenderProductsResult.tsx";
export interface Props {
  /**
   * @title Suggestions Integration
   * @todo: improve this typings ({query: string, count: number}) => Suggestions
   */
  loader: Resolved<Suggestion | null>;

  /**
   * @title Banner
   * @description Banner image to display on the search bar results
   */
  banner?: string;
  /**
   *  @title Banner Mobile
   * @description Banner image to display on the search bar results for mobile screens
   */
  bannerMobile?: string;
  /**
   * @title Banner Alternative Text
   * @description Banner image alternative text to people with disabilities
   */
  bannerAlt?: string;
}
export const action = async (props: Props, req: Request, ctx: AppContext) => {
  const {
    loader: { __resolveType, ...loaderProps },
    ...otherProps
  } = props;
  const form = await req.formData();
  const query = `${form.get(NAME ?? "q")}`;
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = (await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  })) as Suggestion | null;
  return { suggestion, ...otherProps };
};

export const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const {
    loader: { __resolveType, ...loaderProps },
    ...otherProps
  } = props;
  const query = new URL(req.url).searchParams.get(NAME ?? "q");
  // @ts-expect-error This is a dynamic resolved loader
  const suggestion = (await ctx.invoke(__resolveType, {
    ...loaderProps,
    query,
  })) as Suggestion | null;
  return { suggestion, ...otherProps };
};

function Suggestions({ suggestion, banner, bannerAlt, bannerMobile }: ComponentProps<typeof loader, typeof action>) {
  const { products = [], searches = [] } = suggestion ?? {};
  const hasProducts = Boolean(products?.length);
  const hasTerms = Boolean(searches.length);
  const hasBanner = Boolean(banner && bannerAlt && bannerMobile);
  return (
    <div class={clx(`pb-5 desk:pb-8`, !hasProducts && !hasTerms && "hidden")}>
      <div class="desk:gap-11 desk:grid desk:grid-cols-[185px_1fr_443px]">
        <div class="flex flex-col gap-5 border-b desk:border-r border-dashed border-secundary pb-5 desk:pr-[13px]">
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
        <div class="flex flex-col gap-5 overflow-hidden pt-5 pb-6 desk:pt-0 desk:pb-0">
          <span class="font-bold text-[13px] text-primary leading-[19.5px]" role="heading" aria-level={3}>
            Produtos
          </span>
          <RenderProductsResults products={products ?? []} />
        </div>
        {hasBanner && (
          <Picture preload={false} className="flex justify-center">
            <Source media="(max-width: 767px)" fetchPriority={"auto"} src={bannerMobile as string} width={335} height={132} />
            <Source media="(min-width: 768px)" fetchPriority={"auto"} src={banner as string} width={443} height={295} />
            <img class="w-[335px] h-[132px] desk:w-[443px] desk:h-[295px] object-cover" loading={"lazy"} src={banner as string} alt={bannerAlt} />
          </Picture>
        )}
      </div>
    </div>
  );
}

export default Suggestions;
