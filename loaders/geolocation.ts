import { getCookies } from "std/http/cookie.ts";
import { AppContext } from "../apps/deco/vtex.ts";

const maskedCep = (cep: string) => {
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};

async function loader(_props: unknown, req: Request, _ctx: AppContext) {
  const cookies = getCookies(req.headers);
  const segmentCookie = cookies["vtex_segment"];
  const sessionCookie = cookies["vtex_session"];
  if (!segmentCookie || !sessionCookie) return undefined;
  interface VtexSessionResponse {
    namespaces?: {
      public?: {
        postalCode?: {
          value?: string;
        };
      };
    };
  }
  const response = await fetch(
    "https://alphabeto.myvtex.com/api/sessions?items=public.postalCode",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        cookie: `vtex_session=${sessionCookie}; vtex_segment=${segmentCookie}`,
      },
    },
  );
  const data = (await response.json()) as VtexSessionResponse;
  const cep = data?.namespaces?.public?.postalCode?.value;
  if (!cep) return undefined;
  return maskedCep(cep);
}

export default loader;
