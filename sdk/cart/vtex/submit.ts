import { type AppContext } from "apps/vtex/mod.ts";
import { type CartSubmitActions } from "../../../actions/minicart/submit.ts";
import { Cart } from "./types.ts";
import { cartFrom } from "./utils/cartFrom.ts";
import { loadSizes } from "./utils/loadSizes.ts";

const actions: CartSubmitActions<AppContext> = {
  addToCart: async ({ addToCart }, req, ctx) => {
    const response = (await ctx.invoke(
      "vtex/actions/cart/addItems.ts",
      // @ts-expect-error I don't know how to fix this
      addToCart
    )) as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
  setQuantity: async ({ items }, req, ctx) => {
    const response = (await ctx.invoke("vtex/actions/cart/updateItems.ts", {
      allowedOutdatedData: ["paymentData"],
      orderItems: items.map((quantity, index) => ({ quantity, index })),
    })) as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
  setCoupon: async ({ coupon }, req, ctx) => {
    const response = (await ctx.invoke("vtex/actions/cart/updateCoupons.ts", { text: coupon ?? undefined })) as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
  setSellerCode: async ({ sellerCode }, req, ctx) => {
    console.log({ sellerCode });
    const response = (await ctx.invoke("vtex/loaders/cart.ts")) as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
};

export default actions;
