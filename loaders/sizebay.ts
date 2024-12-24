import { AppContext } from "site/apps/site.ts";
import { getCookies } from "std/http/cookie.ts";
import { setCookie } from "std/http/mod.ts";

export interface Props {
  productUrl: string;
}

interface MyProductIdResponse {
  accessory: boolean;
  clothesType: string;
  id: string;
  mixMatch: boolean;
  shoe: boolean;
}

const SIZEBAY_COOKIE_NAME = "SIZEBAY_SESSION_ID_V4";
const SIZEBAY_TENANT_ID = "1893";

export default async function SizeBayLoader(
  { productUrl }: Props,
  req: Request,
  ctx: AppContext,
) {
  try {
    const cookies = getCookies(req.headers);
    let SID: string | null = cookies[SIZEBAY_COOKIE_NAME];

    const productURLObject = new URL(productUrl);
    productURLObject.hostname = "www.alphabeto.com";
    productURLObject.protocol = "https";
    productURLObject.port = "";

    if (SID) {
      const response = await fetch(
        `https://vfr-v3-production.sizebay.technology/api/me/session-id`,
      ).then((res) => res.text());
      SID = response.replace(/"/g, "");

      setCookie(ctx.response.headers, {
        value: SID,
        name: SIZEBAY_COOKIE_NAME,
        path: "/",
        secure: true,
        httpOnly: true,
      });
    }
    const sizeBayProductResponse = await fetch(
      `https://vfr-v3-production.sizebay.technology/plugin/my-product-id?sid=${SID}&permalink=${productURLObject.href}`,
    ).then((res) => res.json()) as MyProductIdResponse;

    const productId = sizeBayProductResponse.id;
    return {
      virtualFittingRoom:
        `https://vfr-v3-production.sizebay.technology/V4/?mode=vfr&id=${productId}&tenantId=${SIZEBAY_TENANT_ID}&sid=${SID}&lang=pt&watchOpeningEvents=true`,
      measurementChart:
        `https://vfr-v3-production.sizebay.technology/V4/?mode=chart&id=${productId}&tenantId=${SIZEBAY_TENANT_ID}&sid=${SID}&lang=pt&watchOpeningEvents=true`,
    };
  } catch (_e) {
    console.log("Sizebay loader error: ", _e);
    return null;
  }
}

export type SizeBaySettings = Awaited<ReturnType<typeof SizeBayLoader>>;
