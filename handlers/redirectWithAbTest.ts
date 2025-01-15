import { isFreshCtx } from "apps/website/handlers/fresh.ts";
import Proxy from "apps/website/handlers/proxy.ts";
import { getCookies } from "std/http/cookie.ts";

type ConnInfo = Deno.ServeHandlerInfo;
export interface RedirectConfig {
  to: string;
  type?: "permanent" | "temporary";
  discardQueryParameters?: boolean;
  cookieMatcherName: string;
  cookieMatcherValue: "0" | "1";
}

/**
 * @title Redirect
 * @description Redirect request to another url
 */
export default function Redirect(
  {
    to,
    type = "temporary",
    discardQueryParameters,
    cookieMatcherName,
    cookieMatcherValue,
  }: RedirectConfig,
) {
  /** https://archive.is/kWvxu */
  const statusByRedirectType: Record<
    NonNullable<RedirectConfig["type"]>,
    number
  > = {
    "temporary": 307,
    "permanent": 301,
  };

  return async (req: Request, conn: ConnInfo) => {
    const cookies = getCookies(req.headers);
    const namesOfCookies = Object.keys(cookies);
    const findedAbCookie = namesOfCookies.find((cookieName) =>
      cookieName.includes(cookieMatcherName)
    );
    const cookie = findedAbCookie ? cookies[findedAbCookie] : "";
    const hasExpectedFinalValue = cookie.endsWith(cookieMatcherValue);

    if (!hasExpectedFinalValue && isFreshCtx(conn)) {
      return await Proxy({
        url: "https://secure.alphabeto.com",
        host: "secure.alphabeto.com",
      })(req, conn);
    }
    const params = isFreshCtx(conn) ? conn.params ?? {} : {};
    /**
     * This allows redirects to have dynamic parameters.
     *
     * e.g: from /admin/:site to /new-admin/:site
     */
    const location = Object.keys(params).length > 0
      ? to.replace(/:[^\/]+/g, (g) => (params[g.substr(1)]))
      : to;

    const incomingUrl = new URL(req.url);
    const queryString = incomingUrl.search.slice(1);

    /**
     * This makes sure that incoming query strings are kept
     *
     * (Useful for tracking parameters e.g Google's gclid, utm_source...)
     */
    const finalLocation = !queryString || discardQueryParameters
      ? location
      : location.includes("?")
      ? `${location}&${queryString}`
      : `${location}?${queryString}`;

    return new Response(null, {
      status: statusByRedirectType[type],
      headers: {
        location: finalLocation,
      },
    });
  };
}
