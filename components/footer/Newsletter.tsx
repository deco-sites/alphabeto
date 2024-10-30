import { useScript } from "@deco/deco/hooks";
import { AppContext } from "site/apps/deco/vtex.ts";
import {
  NewsletterStarsOne,
  NewsletterStarsThree,
  NewsletterStarsTwo,
} from "site/components/footer/NewsletterStars.tsx";
import { Newsletter as Props } from "site/components/footer/types.ts";
import Button from "site/components/ui/Button.tsx";
import Input, { RadioInput } from "site/components/ui/Input.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { useComponent } from "site/sections/Component.tsx";

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
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const form = document.getElementById(formId) as HTMLFormElement;
  form.reset();
  const submitButton = form.querySelector(
    "button[type=submit]",
  ) as HTMLButtonElement;
  submitButton.disabled = false;
  submitButton.innerText = "Enviar";
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

export default function Newsletter(props: Props) {
  const formState = props.formState ?? "idle";
  const sanitizedCode = sanitizeHTMLCode(props.title, {
    removeAttributes: true,
    removeWrapperTag: true,
    allowedTags: ["span", "strong"],
  });

  return (
    <div className="bg-secondary-content ">
      <div className="flex flex-col desk:flex-row p-5 desk:p-10 items-center gap-[30px] justify-between mx-auto max-w-[1440px] relative">
        <div className="desk:max-w-[422px] flex flex-col max-1240:max-w-[300px]">
          <h3
            dangerouslySetInnerHTML={{
              __html: sanitizedCode,
            }}
            className="text-[28px] desk:text-[40px] leading-8 desk:leading-[48px] text-center desk:text-left font-medium text-[#676767] font-beccaPerry [&_strong]:text-primary [&_strong]:font-medium"
          />
          {props.description && (
            <p className="text-[13px] leading-[19.5px] desk:font-medium text-[#7E7F88] pt-4 desk:text-base max-w-[371px] text-center desk:text-left">
              {props.description}
            </p>
          )}
        </div>
        <form
          className="flex flex-col desk:grid grid-cols-2  grid-rows-2 gap-4 desk:mr-[99px] max-1330:mr-0  w-full desk:w-auto"
          id={formId}
          hx-post={useComponent(import.meta.url, props)}
          hx-target={`#${submitButtonWrapperId}`}
          hx-swap="outerHTML"
          hx-indicator={`#${submitButtonWrapperId}`}
          hx-select={`#${submitButtonWrapperId}`}
          {...{
            "hx-on::before-send": useScript(beforeFormSubmit, formId),
            "hx-on::after-settle": useScript(afterFormSubmit, formId),
          }}
        >
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
          <div className="flex flex-col desk:flex-row justify-between gap-9">
            <div>
              <span className="text-xs leading-[14.4px] text-[#676767] font-semibold block">
                Tenho Interresse em:
              </span>
              <div className="flex gap-[14px] pt-[14px]">
                <div className="flex items-center">
                  <RadioInput
                    name="interest"
                    value="boys"
                    id="boysInterest"
                    required
                  />
                  <label
                    className="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
                    htmlFor="boysInterest"
                  >
                    Meninos
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioInput
                    name="interest"
                    value="girls"
                    id="girlsInterest"
                    required
                  />
                  <label
                    className="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
                    htmlFor="girlsInterest"
                  >
                    Meninas
                  </label>
                </div>
                <div className="flex items-center">
                  <RadioInput
                    name="interest"
                    value="any"
                    id="anyInterest"
                    required
                  />
                  <label
                    className="text-xs leading-[14.4px] text-[#676767] font-medium pl-1"
                    htmlFor="anyInterest"
                  >
                    Ambos
                  </label>
                </div>
              </div>
            </div>
            <div id={submitButtonWrapperId}>
              {formState === "idle"
                ? (
                  <Button
                    className="h-11 px-5"
                    type="submit"
                  >
                    <span class="[.htmx-request_&]:hidden">Enviar</span>
                    <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
                  </Button>
                )
                : (
                  <Button
                    className="h-11 px-5"
                    disabled
                    type="submit"
                  >
                    {formState === "success" ? "Enviado" : "Erro"}
                  </Button>
                )}
            </div>
          </div>
        </form>
        <NewsletterStarsOne className="absolute top-[51px] left-[429px] hidden desk:block max-1240:left-[310px]" />
        <NewsletterStarsTwo className="absolute right-[85px] bottom-[45px] hidden desk:block max-1330:bottom-6" />
        <NewsletterStarsThree className="absolute block desk:hidden top-[57px] right-[10px]" />
      </div>
    </div>
  );
}
