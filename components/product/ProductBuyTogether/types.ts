import { Product } from "apps/commerce/types.ts";
import {
  BuyTogetherInitialProductsResponse,
} from "site/loaders/BuyTogether/types.ts";
import { Signal } from "@preact/signals";
import { RequestURLParam } from "apps/website/functions/requestToParam.ts";

export interface SugestionProductSignal {
  product: Product;
  enabled: boolean;
  selectedVariant: string;
}
export interface PrincipalProductSignal {
  product: Product;
  selectedVariant: string;
}

export interface BuyTogetgherLoaderProps {
  /**
   * @title Collection ID
   * @description (e.g.: 150)
   * @pattern \d*
   * @format dynamic-options
   * @options vtex/loaders/collections/list.ts
   */
  collection: string;
  slug: RequestURLParam;
}

export interface BuyTogetherLoaderResponse {
  result: BuyTogetherInitialProductsResponse;
  newProductLoaderData: {
    collection: string;
    department: string;
  };
}
export interface ProductSkuSelectorProps {
  signal: Signal<PrincipalProductSignal> | Signal<SugestionProductSignal>;
}
export type ProductCardProps =
  | {
    mode: "principal";
    signal: Signal<PrincipalProductSignal>;
  }
  | {
    mode: "sugestion";
    signal: Signal<SugestionProductSignal>;
    newProductLoaderData: {
      collection: string;
      department: string;
    };
  };

export interface ProductResumeProps {
  principalProduct: Signal<PrincipalProductSignal>;
  sugestionOne: Signal<SugestionProductSignal>;
  sugestionTwo: Signal<SugestionProductSignal>;
}
export interface PlataformProps {
  allowedOutdatedData: string[];
  orderItems: Array<{
    quantity: number;
    seller: string;
    id: string;
  }>;
}
