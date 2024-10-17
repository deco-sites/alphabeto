import { AppContext } from "apps/vtex/mod.ts";

import { Cart } from "./types.ts";
import { cartFrom } from "./utils/cartFrom.ts";
import { loadSizes } from "./utils/loadSizes.ts";

async function loader(_props: unknown, req: Request, ctx: AppContext): Promise<Minicart> {
  const response = (await ctx.invoke("vtex/loaders/cart.ts")) as Cart;
  const skuInformation = await loadSizes(response, ctx);

  return cartFrom(response, req.url, skuInformation);
}

export default loader;
