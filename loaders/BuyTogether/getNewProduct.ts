import { AppContext } from "site/apps/deco/vtex.ts";
import { getRandomNumber } from "site/sdk/numberUtils.ts";
import { pickRandomItem } from "site/sdk/arrayUtils.ts";
import {
  BuyTogetherNewProductsProps,
  BuyTogetherNewProductsResponse,
} from "site/loaders/BuyTogether/types.ts";
import { EXTENSIONS } from "site/loaders/BuyTogether/constants.ts";

async function useCollectionMethod(
  ctx: AppContext,
  collection: string,
  department: string,
  notShowProductIds: string[],
) {
  const results = await ctx.invoke.vtex.loaders.intelligentSearch
    .productListingPage({
      count: 1,
      query: "",
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "productClusterIds",
        value: collection,
      }, {
        key: "category-1",
        value: department,
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
      }, {
        key: "category-1",
        value: department,
      }],
    });
  if (!result?.products) return null;
  while (true) {
    const randomProduct = pickRandomItem(result.products);
    const randomProductID = randomProduct.isVariantOf?.productGroupID ?? "";
    const isNotShowProduct = notShowProductIds.includes(randomProductID);
    if (isNotShowProduct) continue;
    return randomProduct;
  }
}

async function useTermMethod(
  ctx: AppContext,
  term: string,
  department: string,
  notShowProductIds: string[],
) {
  const results = await ctx.invoke.vtex.loaders.intelligentSearch
    .productListingPage({
      count: 1,
      query: term,
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "category-1",
        value: department,
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
      query: term,
      page: randomPage,
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "category-1",
        value: department,
      }],
    });
  if (!result?.products) return null;
  while (true) {
    const randomProduct = pickRandomItem(result.products);
    const randomProductID = randomProduct.isVariantOf?.productGroupID ?? "";
    const isNotShowProduct = notShowProductIds.includes(randomProductID);
    if (isNotShowProduct) continue;
    return randomProduct;
  }
}

export default async function loader(
  props: BuyTogetherNewProductsProps,
  _req: Request,
  ctx: AppContext,
): Promise<BuyTogetherNewProductsResponse> {
  const { collection, department, term, notShowProductsIds } = props;

  const randomProduct = term
    ? await useTermMethod(ctx, term, department, notShowProductsIds)
    : await useCollectionMethod(
      ctx,
      collection,
      department,
      notShowProductsIds,
    );

  if (!randomProduct) return null;

  const [randomProductWithExtension] = await ctx.invoke.vtex.loaders.product
    .extend({
      products: [randomProduct],
      ...EXTENSIONS,
    });

  return {
    newSugestion: randomProductWithExtension,
  };
}
