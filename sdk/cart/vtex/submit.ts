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
    )) as unknown as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
  setQuantity: async ({ items }, req, ctx) => {
    const response = (await ctx.invoke("vtex/actions/cart/updateItems.ts", {
      allowedOutdatedData: ["paymentData"],
      orderItems: items.map((quantity, index) => ({ quantity, index })),
    })) as unknown as Cart;
    const skuInformation = await loadSizes(response, ctx);

    return cartFrom(response, req.url, skuInformation);
  },
  setCoupon: async ({ coupon }, req, ctx) => {
    const response = (await ctx.invoke("vtex/actions/cart/updateCoupons.ts", { text: coupon ?? undefined })) as unknown as Cart;
    const skuInformation = await loadSizes(response, ctx);
    const notFoundCoupon = response.messages?.some((message) => message.code === "couponNotFound");
    if (notFoundCoupon) {
      await ctx.invoke("vtex/actions/cart/clearOrderformMessages.ts");
      throw new Error("COUPON_NOT_FOUND");
    }
    return cartFrom(response, req.url, skuInformation);
  },
  setSellerCode: async ({ sellerCode }, req, ctx) => {
    const sellerCodeOnly = sellerCode?.split(" ")[0] ?? "";
    interface MasterDataResponse extends Document {
      name: string;
    }
    if (sellerCodeOnly.length === 0) {
      const response = (await ctx.invoke("vtex/actions/cart/updateAttachment.ts", {
        attachment: "openTextField",
        body: { value: "" },
      })) as unknown as Cart;
      const skuInformation = await loadSizes(response, ctx);
      return cartFrom(response, req.url, skuInformation);
    }
    const masterDataResponse = await fetch(`https://alphabeto.myvtex.com/api/dataentities/CV/search?_schema=v2&_fields=name&_where=(cod=${sellerCodeOnly} AND ativo=true)`, { headers: { accept: "application/vnd.vtex.ds.v10.v2+json" } });
    const masterDataResponseJson = (await masterDataResponse.json()) as MasterDataResponse[];
    if (masterDataResponseJson.length === 0) throw new Error("SELLER_CODE_NOT_FOUND");
    const sellerCodeValue = `${sellerCodeOnly} - ${masterDataResponseJson[0].name}`;
    const response = (await ctx.invoke("vtex/actions/cart/updateAttachment.ts", {
      attachment: "openTextField",
      body: { value: sellerCodeValue },
    })) as unknown as Cart;
    const skuInformation = await loadSizes(response, ctx);
    return cartFrom(response, req.url, skuInformation);
  },
  setShipping: async ({ cep }, req, ctx) => {
    const cepNumberOnly = cep?.replace(/\D/g, "") ?? "";

    const response = (await ctx.invoke("vtex/actions/cart/updateAttachment.ts", {
      attachment: "shippingData",
      body: {
        address: {
          addressType: "search",
          country: "BRA",
          postalCode: cepNumberOnly,
        },
      },
    })) as unknown as Cart;

    const skuInformation = await loadSizes(response, ctx);
    return cartFrom(response, req.url, skuInformation);
  },
};

export default actions;
