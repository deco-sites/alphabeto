import { Product } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/deco/vtex.ts";
import { EXTENSIONS } from "site/loaders/BuyTogether/constants.ts";
import {
  BuyTogetherInitialProductsResponse,
  BuyTogetherIntialProductProps,
} from "site/loaders/BuyTogether/types.ts";
import { pickRandomItem } from "site/sdk/arrayUtils.ts";
import { getRandomNumber } from "site/sdk/numberUtils.ts";

const QTD_SUGESTIONS = 2;

async function useCollectionMethod(
  collection: string,
  department: string,
  category: string,
  ctx: AppContext,
  currentProductId: string,
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
  if (qtdOfProducts < QTD_SUGESTIONS) return null;
  const sugestions: Product[] = [];

  // This logic to fix max number of pages to 50 is necessary because the VTEX Inteligent Search API has a limit of 50 pages
  const qtdOfPages = Math.min(Math.ceil(qtdOfProducts / 50), 50);
  const itensPerPage = Math.ceil(qtdOfProducts / qtdOfPages);

  for (let i = 0; i < QTD_SUGESTIONS; i++) {
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
    if (result?.products) {
      const randomProduct = pickRandomItem(result.products);
      const randomProductId = randomProduct.isVariantOf?.productGroupID;
      const isSameOfPrincipalProduct = randomProductId === currentProductId;
      const isSameOfSugestions = sugestions.some((sugestion) =>
        sugestion.isVariantOf?.productGroupID === randomProductId
      );
      if (isSameOfPrincipalProduct || isSameOfSugestions) i--;
      else sugestions.push(randomProduct);
    }
  }
  return { sugestions, enableRefresh:  qtdOfProducts > (QTD_SUGESTIONS + 1)  };
}
async function useTermMethod(
  term: string,
  department: string,
  category: string,
  ctx: AppContext,
  currentProductId: string,
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
  if (qtdOfProducts < QTD_SUGESTIONS) return null;
  const sugestions: Product[] = [];

  // This logic to fix max number of pages to 50 is necessary because the VTEX Inteligent Search API has a limit of 50 pages
  const qtdOfPages = Math.min(Math.ceil(qtdOfProducts / 50), 50);
  const itensPerPage = Math.ceil(qtdOfProducts / qtdOfPages);

  for (let i = 0; i < QTD_SUGESTIONS; i++) {
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
    if (result?.products) {
      const randomProduct = pickRandomItem(result.products);
      const randomProductId = randomProduct.isVariantOf?.productGroupID;
      const isSameOfPrincipalProduct = randomProductId === currentProductId;
      const isSameOfSugestions = sugestions.some((sugestion) =>
        sugestion.isVariantOf?.productGroupID === randomProductId
      );
      if (isSameOfPrincipalProduct || isSameOfSugestions) i--;
      else sugestions.push(randomProduct);
    }
  }

  return { sugestions, enableRefresh: qtdOfProducts > (QTD_SUGESTIONS + 1) };
}

function findTerm(
  productName: string,
  terms: string[],
) {
  const productNameLower = productName.toLowerCase();
  const termsLower = terms.map((term) => term.toLowerCase());
  const term = termsLower.find((term) => productNameLower.includes(term));
  return term;
}

export default async function loader(
  props: BuyTogetherIntialProductProps,
  _req: Request,
  ctx: AppContext,
): Promise<BuyTogetherInitialProductsResponse> {
  const { collection, slug, terms } = props;
  const principalProductPage = await ctx.invoke.vtex.loaders.intelligentSearch
    .productDetailsPage({
      slug,
    });
  const principalProduct = principalProductPage?.product;
  if (!principalProduct) return null;
  const productName = principalProduct.isVariantOf?.name ??
    principalProduct.name ?? "";
  const department =
    principalProduct.category?.split(">")[0].trim().toLowerCase() ?? "";
  const category =
    principalProduct.category?.split(">")[1].trim().toLowerCase() ?? "";
  const currentProductId = principalProduct.isVariantOf?.productGroupID ?? "";
  const term = findTerm(productName, terms);
  const result = term
    ? await useTermMethod(
      term,
      department,
      category,
      ctx,
      currentProductId,
    )
    : await useCollectionMethod(
      collection,
      department,
      category,
      ctx,
      currentProductId,
    );

  if (!result) return null;
  const { sugestions, enableRefresh } = result;

  const allProducts = [principalProduct, ...sugestions];
  const [principalProductWithExtensions, ...sugestionsWithExtensions] =
    await ctx.invoke.vtex.loaders.product.extend({
      products: allProducts,
      ...EXTENSIONS,
    });

  return {
    principalProduct: principalProductWithExtensions,
    sugestions: sugestionsWithExtensions,
    enableRefresh,
    newProductLoaderData: {
      collection,
      department,
      category,
      term,
    },
  };
}
