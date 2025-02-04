import { AppContext } from "site/apps/deco/vtex.ts";
import { EXTENSIONS } from "site/loaders/BuyTogether/constants.ts";
import {
  BuyTogetherNewProductsProps,
  BuyTogetherNewProductsResponse,
} from "site/loaders/BuyTogether/types.ts";
import { pickRandomItem } from "site/sdk/arrayUtils.ts";
import { getRandomNumber } from "site/sdk/numberUtils.ts";

async function useCollectionMethod(
  ctx: AppContext,
  collection: string,
  department: string,
  category: string,
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
      }, {
        key: "category-2",
        value: category,
      }],
    });
  const qtdOfProducts = results?.pageInfo.records ?? 0;
  if (qtdOfProducts < 1) return null;

  // This logic to fix max number of pages to 50 is necessary because the VTEX Inteligent Search API has a limit of 50 pages
  const qtdOfPages = Math.min(Math.ceil(qtdOfProducts / 50), 50);
  const itensPerPage = Math.ceil(qtdOfProducts / qtdOfPages);

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
      }, {
        key: "category-2",
        value: category,
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
  category: string,
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
      }, {
        key: "category-2",
        value: category,
      }],
    });
  const qtdOfProducts = results?.pageInfo.records ?? 0;
  if (qtdOfProducts < 1) return null;

  // This logic to fix max number of pages to 50 is necessary because the VTEX Inteligent Search API has a limit of 50 pages
  const qtdOfPages = Math.min(Math.ceil(qtdOfProducts / 50), 50);
  const itensPerPage = Math.ceil(qtdOfProducts / qtdOfPages);

  const randomPage = getRandomNumber(0, qtdOfPages - 1);
  const result = await ctx.invoke.vtex.loaders.intelligentSearch
    .productListingPage({
      count: itensPerPage,
      query: term,
      page: randomPage,
      hideUnavailableItems: true,
      selectedFacets: [{
        key: "category-1",
        value: department,
      }, {
        key: "category-2",
        value: category,
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
  const { collection, department, category, term, notShowProductsIds } = props;

  const randomProduct = term
    ? await useTermMethod(ctx, term, department, category, notShowProductsIds)
    : await useCollectionMethod(
      ctx,
      collection,
      department,
      category,
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
