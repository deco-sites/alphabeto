import { AppContext } from "site/apps/site.ts";

export default function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) {
  return ctx.globalSettings;
}
