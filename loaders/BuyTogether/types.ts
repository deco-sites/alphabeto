import { Product } from "apps/commerce/types.ts";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

export type BuyTogetherNewProductsResponse = {
  newSugestion: Product;
} | null;

export type BuyTogetherInitialProductsResponse = {
  principalProduct: Product;
  sugestions: Product[];
  enableRefresh: boolean;
  newProductLoaderData: {
    collection: string;
    department: string;
    category: string;
    term?: string;
  };
} | null;

export interface BuyTogetherNewProductsProps {
  /**
   * @title Collection ID
   * @description (e.g.: 150)
   * @pattern \d*
   * @format dynamic-options
   * @options vtex/loaders/collections/list.ts
   */
  collection: string;
  department: string;
  category: string;
  term?: string;
  notShowProductsIds: string[];
}
export interface BuyTogetherIntialProductProps {
  /**
   * @title Collection ID
   * @description (e.g.: 150)
   * @pattern \d*
   * @format dynamic-options
   * @options vtex/loaders/collections/list.ts
   */
  collection: string;
  slug: RequestURLParam;
  terms: string[];
  notShowProductsIds: string[];
}
