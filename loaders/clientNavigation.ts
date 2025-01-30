import { useScriptAsDataURI } from "@deco/deco/hooks";
import { Script } from "apps/website/types.ts";
const snippet = () => {
  const clientNavigation = (e: Event) => {
    e.preventDefault();
    if (e.arguments?.[2]) {
      window.location.href = window.location.origin + e.arguments[2];
    }
  };
  addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("last-page", window.location.href);
  });
  addEventListener("pushstate", clientNavigation);
};
const loader = (): Script => {
  const transformReq = () => {
    const script = `<script defer src="${
      useScriptAsDataURI(snippet)
    }"></script>`;
    return script;
  };
  return ({ src: transformReq });
};
export default loader;
