import { RichText } from "apps/admin/widgets.ts";
import Button from "site/components/ui/Button.tsx";
import Input, { TextArea } from "site/components/ui/Input.tsx";
import { COMMON_HTML_TAGS_TO_ALLOW } from "site/constants.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { AppContext } from "site/apps/deco/vtex.ts";
import { useSection } from "@deco/deco/hooks";

/** @titleBy name	*/
interface Item {
  name: string;
  value: string;
}

interface Props {
  title: string;
  description: RichText;
  contact: {
    title: string;
    description: RichText;
    itens: Item[];
  };
  state?: "idle" | "loading" | "success" | "error";
}

export async function action(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Props> {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const phone = formData.get("phone");
    const message = formData.get("message");
    await ctx.invoke.vtex.actions.masterdata.createDocument({
      acronym: "FC",
      data: {
        name: name,
        telefone: phone,
        mensagem: message,
      },
    });
    return {
      ...props,
      state: "success",
    };
  } catch (_e) {
    return {
      ...props,
      state: "error",
    };
  }
}

export default function ContactUs(props: Props) {
  return (
    <div class="max-w-[667px] w-[calc(100dvw_-_40px)]">
      <h1 class="font-beccaPerry text-[32px] leading-[38px] desk:text-[44px] desk:leading-[52px] text-accent mb-5">
        {props.title}
      </h1>
      <p
        class="text-[13px] leading-[18px] desk:text-[16px] desk:leading-6 text-[#7e7f88] [&>a]:text-primary [&>a]:font-bold [&>a]:underline"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTMLCode(props.description, {
            removeEmptyTags: true,
            allowedTags: [...COMMON_HTML_TAGS_TO_ALLOW, "br"],
            removeWrapperTag: true,
          }),
        }}
      />
      <form
        hx-post={useSection({ props })}
        hx-target="closest section"
        class="mt-[53px] mobile:mt-[45px] flex flex-col mobile:gap-8 gap-6"
      >
        <div class="grid grid-cols-[1fr_168px] mobile:flex mobile:flex-col gap-8">
          <div class="flex flex-col gap-1">
            <label
              for="name"
              class="text-[12px] leading-[18px] text-accent font-bold"
            >
              Nome completo*
            </label>
            <Input
              class="h-11"
              id="name"
              name="name"
              placeholder="Digite aqui"
              required
            />
          </div>
          <div class="flex flex-col gap-1">
            <label
              for="phone"
              class="text-[12px] leading-[18px] text-accent font-bold"
            >
              Celular*
            </label>
            <Input
              class="h-11"
              id="phone"
              name="phone"
              placeholder="(xx) xxxxx-xxxx"
              required
            />
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label
            for="message"
            class="text-[12px] leading-[18px] text-accent font-bold"
          >
            Mensagem*
          </label>
          <TextArea id="message" name="message" required class="h-[263px]" />
        </div>
        <Button type="submit" class="w-[300px] h-[44px] mobile:w-full">
          Enviar
        </Button>
        {props.state === "success" && (
          <p class="text-green-500">Mensagem enviada com sucesso!</p>
        )}
        {props.state === "error" && (
          <p class="text-red-500">Erro ao enviar mensagem!</p>
        )}
      </form>
      <div class="mt-20 mobile:mt-[60px]">
        <h2 class="text-[40px] leading-[48px] font-beccaPerry font-medium text-accent mobile:text-[28px] mobile:leading-[33px]">
          {props.contact.title}
        </h2>
        <p
          class="text-[16px] leading-6 font-medium text-[#7e7f88] mt-5 mobile:text-[14px] mobile:leading-5"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTMLCode(props.contact.description, {
              removeEmptyTags: true,
              allowedTags: [...COMMON_HTML_TAGS_TO_ALLOW, "br"],
              removeWrapperTag: true,
            }),
          }}
        />
        <ul class="mt-5 flex flex-col gap-2.5">
          {props.contact.itens.map((item, index) => (
            <li key={index} class="text-[13px] leading-[18px] text-[#7E7F88]">
              <span class="text-primary font-bold">
                {item.name}:
              </span>{" "}
              {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
