import { AppContext } from "apps/vtex/mod.ts";
import { Cart } from "../types.ts";

export interface SkuInformationData {
  color: string;
  size: string;
}

interface GraphQLResponse {
  productsByIdentifier: {
    items: {
      itemId: string;
      variations: {
        name: string;
        values: string[];
      }[];
    }[];
  }[];
}

interface GraphQLVariables {
  field: string;
  values: string[];
}

export const loadSizes = async (cartData: Cart, ctx: AppContext) => {
  const itemsId = cartData.items.map((item) => item.id);
  const { io } = await ctx.invoke.vtex.loaders.config();

  const { productsByIdentifier } = await io.query<
    GraphQLResponse,
    GraphQLVariables
  >(
    {
      operationName: "ProductsByIdentifier",
      query:
        `query ProductsByIdentifier($field: ProductUniqueIdentifierField!, $values: [ID!]) {
          productsByIdentifier(field: $field, values: $values) @context(provider: "vtex.search-graphql") {
            items {
              itemId
              variations {
                name
                values
              }
            }
          }
        }`,
      variables: {
        field: "sku",
        values: itemsId,
      },
    },
    {},
  );

  const skuInformation = productsByIdentifier
    .flatMap((product) => product.items)
    .reduce<Record<string, SkuInformationData>>((acc, item) => {
      const isThisId = itemsId.includes(item.itemId);
      if (!isThisId) return acc;
      const sku = item.itemId;
      const color = item.variations.find((variation) =>
        variation.name.toLowerCase() === "cor"
      )?.values[0] ?? "";
      const size = item.variations.find((variation) =>
        variation.name.toLowerCase() === "tamanho"
      )?.values[0] ?? "";
      return { ...acc, [sku]: { color, size } };
    }, {} as Record<string, SkuInformationData>);

  return skuInformation;
};
