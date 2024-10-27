import { type AppContext } from "../../apps/site.ts";
import { type Minicart } from "../../components/minicart/Minicart.tsx";
import { usePlatform } from "../../sdk/usePlatform.tsx";

import linx from "../../sdk/cart/linx/submit.ts";
import nuvemshop from "../../sdk/cart/nuvemshop/submit.ts";
import shopify from "../../sdk/cart/shopify/submit.ts";
import vnda from "../../sdk/cart/vnda/submit.ts";
import vtex from "../../sdk/cart/vtex/submit.ts";
import wake from "../../sdk/cart/wake/submit.ts";

const actions: Record<string, CartSubmitActions> = {
  vtex: vtex as CartSubmitActions,
  vnda: vnda as CartSubmitActions,
  wake: wake as CartSubmitActions,
  linx: linx as CartSubmitActions,
  shopify: shopify as CartSubmitActions,
  nuvemshop: nuvemshop as CartSubmitActions,
};

interface CartFormData {
  items: number[];
  coupon: string | null;
  action: string | null;
  platformCart: unknown;
  addToCart: unknown;
  sellerCode: string | null;
  cep: string | null;
}

export interface CartSubmitActions<AC = unknown> {
  addToCart?: (props: CartFormData, req: Request, ctx: AC) => Promise<Minicart>;
  setQuantity?: (props: CartFormData, req: Request, ctx: AC) => Promise<Minicart>;
  setCoupon?: (props: CartFormData, req: Request, ctx: AC) => Promise<Minicart>;
  setSellerCode?: (props: CartFormData, req: Request, ctx: AC) => Promise<Minicart>;
  setShipping?: (props: CartFormData, req: Request, ctx: AC) => Promise<Minicart>;
}

const safeParse = (payload: string | null) => {
  try {
    return JSON.parse(payload || "null");
  } catch {
    return null;
  }
};

interface FormData {
  entries: () => IterableIterator<[string, string]>;
}

// Reconstruct the cart state from the received form data
const cartFrom = (form: FormData) => {
  const cart: CartFormData = {
    items: [],
    coupon: null,
    platformCart: null,
    action: null,
    addToCart: null,
    sellerCode: null,
    cep: null,
  };

  for (const [name, value] of form.entries()) {
    if (name === "coupon") {
      cart.coupon = value.toString();
    } else if (name === "sellerCode") {
      cart.sellerCode = value.toString();
    } else if (name === "action") {
      cart.action = value.toString();
    } else if (name === "platform-cart") {
      cart.platformCart = safeParse(decodeURIComponent(value.toString()));
    } else if (name.startsWith("item::")) {
      const [_, it] = name.split("::");
      cart.items[Number(it)] = Number(value);
    } else if (name === "add-to-cart") {
      cart.addToCart = safeParse(decodeURIComponent(value.toString()));
    } else if (name === "cep") {
      cart.cep = value.toString();
    }
  }

  return cart;
};

const formActionsToCartActions: Record<string, keyof CartSubmitActions> = {
  "set-coupon": "setCoupon",
  "add-to-cart": "addToCart",
  "set-seller-code": "setSellerCode",
  "set-quantity": "setQuantity",
  "set-shipping": "setShipping",
};

async function action(_props: unknown, req: Request, ctx: AppContext): Promise<Minicart> {
  const platformActions = actions[usePlatform()] as CartSubmitActions;

  const form = cartFrom((await req.formData()) as unknown as FormData);
  const action = form.action as string | null;

  const decoActionName = action === null ? "setQuantity" : action in formActionsToCartActions ? formActionsToCartActions[action] : "setQuantity";
  const handler = platformActions[decoActionName];

  if (!handler) {
    throw new Error(`Unsupported action on platform ${usePlatform()}`);
  }
  return await handler(form, req, ctx);
}

export default action;
