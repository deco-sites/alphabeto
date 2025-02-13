import { useEffect, useState } from "preact/hooks";
import SmartBannerIos from "./Ios.tsx";
import SmartBannerAndroid from "./Android.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
export default function SmartBanner() {
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [smartBanner, setSmartBanner] = useState<boolean>(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (navigator.userAgent.match(/Android/i)) {
      setIsAndroid(true);
    }
    if (
      !(IS_BROWSER && localStorage.getItem("smartBanner") ||
        sessionStorage.getItem("smartBanner"))
    ) {
      timer = setTimeout(() => {
        setSmartBanner(false);
      }, 7000);
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isAndroid) return <SmartBannerIos />;

  return !smartBanner && isAndroid ? <SmartBannerAndroid /> : null;
}
