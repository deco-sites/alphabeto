import { Resolved } from "@deco/deco";
import { Product } from "apps/commerce/types.ts";
import {
  BuyTogetherInitialProductsResponse,
  BuyTogetherNewProductsResponse,
} from "site/loaders/BuyTogether/types.ts";
import { Signal } from "@preact/signals";

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
  buyTogetherInitialLoader: Resolved<BuyTogetherInitialProductsResponse>;
  buyTogetherNewProductsLoader: Resolved<BuyTogetherNewProductsResponse>;
}

export interface BuyTogetherLoaderResponse {
  result: BuyTogetherInitialProductsResponse;
  newProductsLoader: Resolved<BuyTogetherNewProductsResponse>;
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
    newProductsLoader: Resolved<BuyTogetherNewProductsResponse>;
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
