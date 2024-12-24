import { useEffect } from "preact/hooks";
import { RichText } from "apps/admin/widgets.ts";
import { useSignal } from "@preact/signals";
import Button from "site/components/ui/Button.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

interface Props {
  /**@title Texto do popup */
  text: RichText;
  /**@title Rótulo do botão de aceite */
  label: string;
}

const LOCAL_STORAGE_KEY = "accepted_terms";

export default function PopupLGPD({ text, label }: Props) {
  const isAcceptedTerms = useSignal(true);

  const approveAcceptance = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    isAcceptedTerms.value = true;
  };

  const loadAcceptance = () => {
    isAcceptedTerms.value = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
  };

  useEffect(() => {
    loadAcceptance();
  }, []);

  if (isAcceptedTerms.value) return null;

  return (
    <div class="fixed z-[9999] w-full">
      <div class="fixed bg-[#000] opacity-40 top-0 w-full mobile:w-[100%] h-[100vh] mobile:h-[100%]" />
      <div class="fixed bottom-5 mobile:bottom-10 left-[50%] -translate-x-1/2 mobile:flex-col flex items-center justify-between bg-[#F6F6F6] rounded-[8px] p-[20px] w-full max-w-[1117px] mobile:max-w-[335px] h-[74px] mobile:h-[153px]">
        <p
          class="text-[14px] mobile:text-center text-[#808080] [&>a]:text-primary [&>a]:font-medium [&>a]:underline"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTMLCode(text, {
              allowedTags: ["a", "strong"],
              removeWrapperTag: true,
            }),
          }}
        />
        <Button
          class="max-w-[220px] mobile:max-w-[295px] w-full h-[44px]"
          onClick={approveAcceptance}
        >
          {label}
        </Button>
      </div>
    </div>
  );
}
