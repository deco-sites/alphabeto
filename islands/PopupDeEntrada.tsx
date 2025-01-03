import { useScript } from "@deco/deco/hooks";
import { AppContext } from "site/apps/deco/vtex.ts";
import { Newsletter as Props } from "site/components/footer/types.ts";
import Button from "site/components/ui/Button.tsx";
import Image from "apps/website/components/Image.tsx";
import Input, { RadioInput } from "site/components/ui/Input.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { useComponent } from "site/sections/Component.tsx";
import { useEffect, useState } from "preact/hooks";

const submitButtonWrapperId = "NEWSLETTER_FOOTER_SUBMIT_BUTTON_WRAPPER";
const formId = "NEWSLETTER_FOOTER_FORM";

const beforeFormSubmit = (formId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement;
  const submitButton = form.querySelector(
    "button[type=submit]",
  ) as HTMLButtonElement;
  submitButton.disabled = true;
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.disabled = true;
  });
};

const afterFormSubmit = async (formId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const form = document.getElementById(formId) as HTMLFormElement;
  form.reset();
  const submitButton = form.querySelector(
    "button[type=submit]",
  ) as HTMLButtonElement;
  submitButton.disabled = false;
  const span = submitButton.querySelector(".textSpan") as HTMLSpanElement;
  span.innerHTML = "Enviar";
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    input.disabled = false;
  });
};

export async function loader(props: Props, req: Request, ctx: AppContext) {
  if (req.method === "POST") {
    try {
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const child_name = formData.get("childrenName") as string;

      const interestMap = {
        "any": "Ambos",
        "girls": "Menina",
        "boys": "Menino",
      };
      const interest = formData.get("interest") as keyof typeof interestMap;

      await ctx.invoke("vtex/actions/masterdata/createDocument.ts", {
        data: {
          name,
          accept: true,
          email,
          gender: interestMap[interest],
          child_name,
        },
        acronym: "NW",
      });

      return {
        ...props,
        formState: "success",
      };
    } catch (_e) {
      return {
        ...props,
        formState: "error",
      };
    }
  }
  return {
    ...props,
  };
}

export default function PopupDeEntrada(props: Props) {
  const [isClose, setIsClose] = useState(true);

  const handleClick = () => {
    localStorage.setItem("fechado", JSON.stringify(isClose));
    setIsClose(false);
  };

  const verify = localStorage.getItem("fechado");

  useEffect(() => {
    setIsClose(false);
    verify === "true" ? setIsClose(false) : setIsClose(true);
  }, []);

  if (isClose === false) return null;

  const formState = props.formState ?? "idle";
  const sanitizedCode = sanitizeHTMLCode(props.title, {
    removeAttributes: true,
    removeWrapperTag: true,
    allowedTags: ["span", "strong"],
  });

  const texts: Record<typeof formState, string> = {
    idle: "Cadastrar",
    success: "Cadastro realizado",
    error: "Erro",
  };

  return (
    <>
      {isClose && (
        <div>
          <div class="fixed bg-[#000] z-[9998] opacity-40 top-0 w-full mobile:w-[100%] h-[100vh] mobile:h-[100%]">
          </div>
          <div class="relative">
            <div class="fixed left-[49%] -translate-x-1/2 flex top-[15%] bg-secondary-content z-[9999] rounded-[8px]">
              <button onClick={handleClick} class="border-none bg-transparent">
                <Icon
                  class="absolute top-[16px] right-[16px] text-[#ff8300] z-[9999]"
                  id="close"
                />
              </button>
              <Image
                class="rounded-tl-[8px] rounded-bl-[8px]"
                src={props.image ? props.image : ""}
                width={234}
                height={308}
              />
              <div class="max-w-[489px] flex flex-col py-5 desk:py-10 items-center gap-[10px] justify-between container relative">
                <div class="max-w-[489px] w-full flex items-center justify-between">
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: sanitizedCode,
                    }}
                    class="text-[28px] w-[226px] text-center desk:text-left font-medium text-[#676767] font-beccaPerry mb-[16px]"
                  />
                  {props.description && (
                    <p class="text-[12px] font-medium text-[#7E7F88] max-w-[223px] text-center desk:text-left">
                      {props.description}
                    </p>
                  )}
                </div>
                <form
                  class="max-w-[489px]"
                  id={formId}
                  hx-post={useComponent(import.meta.url, props)}
                  hx-target={`#${submitButtonWrapperId} .textSpan`}
                  hx-swap="innerHTML"
                  hx-indicator={`#${submitButtonWrapperId}`}
                  hx-select={`#${submitButtonWrapperId} .textSpan`}
                  {...{
                    "hx-on::before-send": useScript(beforeFormSubmit, formId),
                    "hx-on::after-settle": useScript(afterFormSubmit, formId),
                  }}
                >
                  <div class="flex flex-col desk:grid grid-cols-2  grid-rows-2 gap-4 w-full desk:w-auto mb-[35px]">
                    <Input
                      placeholder="Nome do responsável"
                      type="text"
                      name="name"
                      required
                    />
                    <Input
                      placeholder="E-mail do responsável"
                      type="email"
                      name="email"
                      required
                    />
                    <Input
                      type="text"
                      name="childrenName"
                      placeholder="Nome da criança"
                      required
                    />
                    <div class="flex flex-col desk:flex-row justify-between gap-9">
                      <div>
                        <span class="text-xs leading-[14.4px] text-[#676767] font-semibold block">
                          Tenho Interresse em:
                        </span>
                        <div class="flex gap-[14px] pt-[14px]">
                          <div class="flex items-center">
                            <RadioInput
                              name="interest"
                              value="boys"
                              id="boysInterest"
                              required
                            />
                            <label
                              class="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
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
                              class="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
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
                              class="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
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
                    class="h-11 px-5 w-full"
                    type="submit"
                    id={submitButtonWrapperId}
                  >
                    <span class="[.htmx-request_&]:hidden textSpan">
                      {texts[formState]}
                    </span>
                    <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
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
