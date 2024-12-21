import Input, { TextArea } from "site/components/ui/Input.tsx";
import StarSelector from "site/islands/StarSelector.tsx";
import Button, { ButtonType } from "site/components/ui/Button.tsx";
import { useScript } from "@deco/deco/hooks";
import { SHOW_REVIEW_BUTTON_ID } from "site/components/product/ProductReviews/index.tsx";
import { AppContext } from "site/apps/deco/vtex.ts";
import { useComponent } from "site/sections/Component.tsx";

export const REVIEW_FORM_CONTAINER_ID = "review-form-container";

interface Props {
  productId: string;
  state: "success" | "error" | "idle";
}
export const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Props> => {
  try {
    const formData = await req.formData();
    await ctx.invoke.vtex.actions.review.submit({
      data: {
        approved: false,
        productId: props.productId,
        rating: Number(formData.get("stars")),
        reviewerName: formData.get("name") as string,
        text: formData.get("review") as string,
        title: formData.get("title") as string,
      },
    });
    return {
      ...props,
      state: "success",
    };
  } catch (_e: unknown) {
    return { ...props, state: "error" };
  }
};

export default function ReviewmForm(props: Props) {
  if (props.state === "success") {
    return (
      <h2 class="text-xl leading-6 text-base-content font-bold">
        Avaliação enviada com sucesso!
      </h2>
    );
  }

  if (props.state === "error") {
    return (
      <h2 class="text-xl leading-6 text-base-content font-bold">
        Erro ao enviar avaliação!
      </h2>
    );
  }

  return (
    <div
      id={REVIEW_FORM_CONTAINER_ID}
      style={{
        height: "0px",
      }}
      class="overflow-hidden transition-all duration-300"
    >
      <Button
        hx-on:click={useScript(
          (containerId: string, showButtonId: string) => {
            document
              .getElementById(containerId)
              ?.style.setProperty("height", "0px");
            document
              .getElementById(showButtonId)
              ?.style.setProperty("display", "flex");
          },
          REVIEW_FORM_CONTAINER_ID,
          SHOW_REVIEW_BUTTON_ID,
        )}
        styleType={ButtonType.Tertiary}
        class="max-w-[230px] mt-5 w-full"
      >
        Fechar formulário
      </Button>
      <form
        hx-post={useComponent(import.meta.url, {
          ...props,
        })}
        hx-target="this"
        hx-swap="innerHTML"
        class="flex flex-col mobile:p-5 desk:px-[38px] desk:py-[30px] border border-[#E8E7E5] rounded-lg mt-9"
      >
        <h2 class="text-xl leading-6 text-base-content font-bold">
          Adicionar avaliação
        </h2>
        <label
          class="text-[#676767] text-xs leading-[18px] mb-1 mt-[22px] font-bold"
          for="title"
        >
          Título da Avaliação:
        </label>
        <Input
          name="title"
          id="title"
          type="text"
          placeholder="Título"
          required
        />

        <StarSelector minStars={1} maxStars={5} />

        <label
          for="name"
          class="text-[#676767] text-xs leading-[18px] mb-1 mt-[22px] font-bold"
        >
          Seu nome:
        </label>
        <Input type="text" placeholder="Nome" name="name" id="name" required />

        <label
          class="text-[#676767] text-xs leading-[18px] mb-1 mt-[22px] font-bold"
          name="review"
        >
          Escrever avaliação:
        </label>
        <TextArea
          placeholder="Escreva aqui sua avaliação"
          rows={5}
          id="review"
          name="review"
          required
          class="h-16"
        />

        <Button type="submit" class="mt-[26px] max-w-[232px]">
          Escrever avaliação
        </Button>
      </form>
    </div>
  );
}
