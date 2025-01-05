import { useSignal } from "@preact/signals";
import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { JSX } from "preact";
import { useCallback, useEffect } from "preact/hooks";
import Button from "site/components/ui/Button.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Input, { RadioInput } from "site/components/ui/Input.tsx";
import { invoke } from "site/runtime.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

interface Props {
  title: RichText;
  description: RichText;
  image: ImageWidget;
}

type FormStates = "idle" | "success" | "error" | "loading";

const LOCAL_STORAGE_KEY = "popup-entrada-closed";
const COMMON_SANITIZE_OPTIONS = {
  removeAttributes: true,
  removeWrapperTag: true,
  allowedTags: ["span", "strong"],
};

export default function PopupDeEntrada(props: Props) {
  const isOpened = useSignal(false);
  const formState = useSignal<FormStates>("idle");

  const closeModal = useCallback(() => {
    document.body.style.overflow = "auto";
    isOpened.value = false;
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
  }, []);

  const openModal = useCallback(() => {
    document.body.style.overflow = "hidden";
    isOpened.value = true;
  }, []);

  const loadLocalStorage = useCallback(() => {
    const isClosed = localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
    if (!isClosed) {
      openModal();
    }
  }, []);

  const formSubmit = useCallback<JSX.SubmitEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();
      formState.value = "loading";
      try {
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const child_name = formData.get("childrenName") as string;

        const interestMap = {
          "any": "Ambos",
          "girls": "Menina",
          "boys": "Menino",
        };
        const interest = formData.get("interest") as keyof typeof interestMap;

        await invoke.vtex.actions.masterdata.createDocument({
          data: {
            name,
            accept: true,
            email,
            gender: interestMap[interest],
            child_name,
          },
          acronym: "NW",
        });
        formState.value = "success";
        setTimeout(() => {
          closeModal();
        }, 3000);
      } catch (_e) {
        formState.value = "error";
        setTimeout(() => {
          formState.value = "idle";
        }, 3000);
      }
    },
    [],
  );

  const texts: Record<FormStates, string> = {
    idle: "Cadastrar",
    success: "Cadastro realizado",
    error: "Erro",
    loading: "Carregando...",
  };

  useEffect(() => {
    loadLocalStorage();
  }, []);

  return (
    <>
      {isOpened.value && (
        <div>
          <div class="fixed bg-[#000] z-[9998] opacity-40 top-0 w-dvw h-dvh">
          </div>
          <div class="relative">
            <div class="fixed left-[49%] -translate-x-1/2 flex top-[15%] bg-secondary-content z-[9999] rounded-lg">
              <button onClick={closeModal} class="border-none bg-transparent">
                <Icon
                  class="absolute top-[16px] right-[16px] text-primary z-[9999]"
                  id="close"
                />
              </button>
              <Image
                class="rounded-tl-lg rounded-bl-lg object-cover mobile:hidden"
                src={props.image ? props.image : ""}
                width={214}
                height={308}
              />
              <div class="max-w-[335px] w-[calc(100dvw-_40px)] desk:max-w-[529px] desk:w-full flex flex-col p-5 items-center gap-4 justify-between relative">
                <div class="flex flex-col desk:grid grid-cols-[256px_223px] w-full items-center justify-between mobile:gap-2.5 ">
                  <h3
                    class="text-[25px] leading-[30px] desk:text-[32px] desk:leading-[38px] text-center desk:text-left font-medium text-accent font-beccaPerry [&>strong]:text-primary [&>strong]:font-medium mobile:max-w-[201px] mobile:mx-auto"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTMLCode(
                        props.title,
                        COMMON_SANITIZE_OPTIONS,
                      ),
                    }}
                  />
                  <p
                    class="text-[12px] leading-[18px] font-medium text-[#7E7F88] text-center desk:text-left"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTMLCode(
                        props.description,
                        COMMON_SANITIZE_OPTIONS,
                      ),
                    }}
                  />
                </div>
                <form
                  class="w-full"
                  onSubmit={formSubmit}
                  disabled={formState.value !== "idle"}
                >
                  <div class="flex flex-col desk:grid grid-cols-2  grid-rows-2 gap-2 w-full desk:w-auto mb-[35px]">
                    <Input
                      placeholder="Nome do responsável"
                      type="text"
                      name="name"
                      required
                      class="h-11"
                    />
                    <Input
                      placeholder="E-mail do responsável"
                      type="email"
                      name="email"
                      required
                      class="h-11"
                    />
                    <Input
                      type="text"
                      name="childrenName"
                      placeholder="Nome da criança"
                      required
                      class="h-11"
                    />
                    <div class="flex flex-col desk:flex-row justify-between gap-9">
                      <div>
                        <span class="text-xs leading-[14.4px] text-base-content font-semibold block">
                          Tenho Interresse em:
                        </span>
                        <div class="flex gap-[14px] pt-[14px] mobile:justify-between">
                          <div class="flex items-center">
                            <RadioInput
                              name="interest"
                              value="boys"
                              id="boysInterest"
                              required
                            />
                            <label
                              class="text-xs leading-[14.4px] text-accent font-medium pl-1"
                              htmlFor="boysInterest"
                            >
                              Meninos
                            </label>
                          </div>
                          <div class="flex items-center">
                            <RadioInput
                              name="interest"
                              value="girls"
                              id="girlsInterest"
                              required
                            />
                            <label
                              class="text-xs leading-[14.4px] text-accent font-medium pl-1"
                              htmlFor="girlsInterest"
                            >
                              Meninas
                            </label>
                          </div>
                          <div class="flex items-center">
                            <RadioInput
                              name="interest"
                              value="any"
                              id="anyInterest"
                              required
                            />
                            <label
                              class="text-xs leading-[14.4px] text-accent font-medium pl-1"
                              htmlFor="anyInterest"
                            >
                              Ambos
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    class="h-11 min-h-11 px-5 w-full"
                    type="submit"
                  >
                    {formState.value === "loading"
                      ? <span class="inline loading loading-spinner" />
                      : (
                        <span>
                          {texts[formState.value]}
                        </span>
                      )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
