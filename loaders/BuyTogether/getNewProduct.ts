import { AppContext } from "site/apps/deco/vtex.ts";
import { getRandomNumber } from "site/sdk/numberUtils.ts";
import { pickRandomItem } from "site/sdk/arrayUtils.ts";
import {
  BuyTogetherNewProductsProps,
  BuyTogetherNewProductsResponse,
} from "site/loaders/BuyTogether/types.ts";
import { EXTENSIONS } from "site/loaders/BuyTogether/constants.ts";

export default async function loader(
  props: BuyTogetherNewProductsProps,
  _req: Request,
  ctx: AppContext,
): Promise<BuyTogetherNewProductsResponse> {
  const { collection } = props;

  const results = await ctx.invoke.vtex.loaders.intelligentSearch
    .productListingPage({
      count: 1,
      query: "",
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "productClusterIds",
        value: collection,
      }],
    });
  const qtdOfProducts = results?.pageInfo.records ?? 0;
  if (qtdOfProducts < 1) return null;

  // This logic to fix max number of pages to 50 is necessary because the VTEX Inteligent Search API has a limit of 50 pages
  const itensPerPage = Math.ceil(qtdOfProducts / 50);
  const qtdOfPages = Math.min(Math.ceil(qtdOfProducts / itensPerPage), 50);

  const randomPage = getRandomNumber(1, qtdOfPages);
  const result = await ctx.invoke.vtex.loaders.intelligentSearch
    .productListingPage({
      count: itensPerPage,
      query: "",
      page: randomPage,
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "productClusterIds",
        value: collection,
      }],
    });
  if (!result?.products) return null;
  const randomProduct = pickRandomItem(result.products);

  const [randomProductWithExtension] = await ctx.invoke.vtex.loaders.product
    .extend({
      products: [randomProduct],
      ...EXTENSIONS,
    });

  return {
    newSugestion: randomProductWithExtension,
  };
}
