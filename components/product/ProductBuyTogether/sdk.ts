/*
 * The FrontEndManager is a responsable interface to change and select the products in buy together
 * this uses the htmx library and live enpoints of deco to render new products cards and buy together resume
 */

import { Product } from "apps/commerce/types.ts";

interface BuyTogetherFrontendManager {
  productData: Product;
  selectedProducts: Product[];
  changeProduct: (id: string) => void;
  loadManager: () => void;
}
