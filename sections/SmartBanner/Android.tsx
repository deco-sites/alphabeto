import { useEffect, useState } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.econverse.alphabetobrapp";

export default function SmartBannerAndroid() {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  function closeBanner() {
    setIsOpen(false);
    sessionStorage.setItem("smartBanner", "true");
  }

  function handleInstallApp() {
    setIsOpen(false);
    localStorage.setItem("smartBanner", "true");
  }

  useEffect(() => {
    const isBrowserAndLocalStorage = IS_BROWSER &&
      localStorage.getItem("smartBanner");
    if (
      sessionStorage.getItem("smartBanner") || isBrowserAndLocalStorage
    ) {
      setIsOpen(false);
    }
  }, []);

  return isOpen
    ? (
      <div class="flex justify-between items-center text-center bg-white w-full py-2 px-4">
        <div class="flex items-center gap-3">
          <button onClick={closeBanner}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.227 4.227a.774.774 0 0 1 1.095 0L12 10.905l6.678-6.678a.774.774 0 1 1 1.095 1.095L13.095 12l6.678 6.678a.774.774 0 1 1-1.095 1.095L12 13.095l-6.678 6.678a.774.774 0 1 1-1.095-1.095L10.905 12 4.227 5.322a.774.774 0 0 1 0-1.095Z"
                fill="#808080"
              />
            </svg>
          </button>
          <Image
            src={"https://alphabeto.vtexassets.com/assets/vtex.file-manager-graphql/images/068f5ac4-8e58-4ac4-be9b-24c42951b514___4ae0e31140820b6079ee4d04bfd23389.png"}
            width={52}
            height={52}
            class="rounded-xl"
          />
          <p class="flex flex-col items-baseline text-sm font-bold not-italic leading-[150%] text-gray-400">
            Android
            <span class="text-xs font-medium text-gray-500">
              Vestindo criança como criança
            </span>
          </p>
        </div>
        <a
          onClick={handleInstallApp}
          class="flex items-center py-2 px-5 rounded-[200px] bg-blue-500 text-white text-sm font-semibold no-underline"
          href={PLAY_STORE_URL}
          target="_blank"
        >
          Instalar
        </a>
      </div>
    )
    : null;
}
