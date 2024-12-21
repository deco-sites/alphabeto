import { useScript } from "@deco/deco/hooks";
import { Review } from "apps/commerce/types.ts";
import dayjs from "https://cdn.skypack.dev/dayjs";
import "https://cdn.skypack.dev/dayjs/locale/pt-br";
import relativeTime from "https://cdn.skypack.dev/dayjs/plugin/relativeTime";
import updateLocale from "https://cdn.skypack.dev/dayjs/plugin/updateLocale";
import Selector from "site/islands/Selector.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import ReviewForm, {
  REVIEW_FORM_CONTAINER_ID,
} from "site/components/product/ProductReviews/ReviewForm.tsx";
import Button, { ButtonType } from "site/components/ui/Button.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { useId } from "site/sdk/useId.ts";
import { useComponent } from "site/sections/Component.tsx";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";
import { ReloadProps } from "site/components/product/ProductReviews/Reload.tsx";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("pt-br", {
  relativeTime: {
    future: "há %s",
    past: "em %s",
    s: "alguns segundos",
    m: "um minuto",
    mm: "%d minutos",
    h: "uma hora",
    hh: "%d horas",
    d: "um dia",
    dd: "%d dias",
    M: "um mês",
    MM: "%d meses",
    y: "um ano",
    yy: "%d anos",
  },
});
const Reload = import.meta.resolve("./Reload.tsx");

interface FilterOrSortOption {
  label: string;
  value: string;
  selected: boolean;
}
export interface ProductReviewsData {
  productId: string;
  currentPage: number;
  totalPages: number;
  review: Review[];
  totalReviews: number;
  averageRating: number;
  currentFilters: {
    sortBy: FilterOrSortOption[];
    filterBy: FilterOrSortOption[];
  };
}
export interface Props {
  data: ProductReviewsData;
}

export const SHOW_REVIEW_BUTTON_ID = "show-review-button";

export default function ProductReviews(props: Props) {
  const hasReviews = props.data.review.length > 0;
  const formattedDate = (date: string) => dayjs(date).locale("pt-BR").fromNow();
  const id = useId();
  return (
    <>
      <Spacer />
      <div class="bg-secondary-content" id={id}>
        <div class="hidden [.htmx-request_&]:flex items-center justify-center h-[600px]">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div class="container !max-w-[824px] py-5 desk:py-10 [.htmx-request_&]:hidden">
          <h2 class="text-xs leading-[18px] font-bold text-[#353535]">
            Avaliações e Opniões
          </h2>
          <div class="flex gap-4 mt-5 items-center">
            <ProductRating
              averageRating={props.data.averageRating}
              maxRating={5}
              iconSize={18}
              class="gap-1.5"
            />
            <span class="text-xs leading-[18px] font-bold">
              {props.data.averageRating} Classificação média (
              {props.data.totalReviews} avaliações)
            </span>
          </div>
          <Button
            id={SHOW_REVIEW_BUTTON_ID}
            hx-on:click={useScript(
              (containerId: string, showButtonId: string) => {
                const user = window.STOREFRONT.USER.getUser();
                if (!user) {
                  return alert(
                    "Você precisa estar logado para avaliar o produto",
                  );
                }
                const el = document.getElementById(containerId);
                if (!el) return;
                el.style.setProperty("height", `${el.scrollHeight}px`);
                document
                  .getElementById(showButtonId)
                  ?.style.setProperty("display", "none");
              },
              REVIEW_FORM_CONTAINER_ID,
              SHOW_REVIEW_BUTTON_ID,
            )}
            class="max-w-[232px] w-full mt-5"
          >
            Escrever avaliação
          </Button>
          <ReviewForm productId={props.data.productId} state="idle" />
          <form
            class="mt-9 border-t-secondary border-t"
            hx-target="closest section"
            hx-swap="outerHTML"
            hx-indicator={`#${id}`}
            id="filter-form-review"
            hx-post={useComponent<ReloadProps>(Reload, {
              productId: props.data.productId,
              actualPage: props.data.currentPage,
            })}
          >
            <div class="grid gap-[30px] grid-cols-[167px_112px] mt-9">
              <Selector
                placeholder="Ordernar Por:"
                values={props.data.currentFilters.sortBy}
                selectProps={{
                  name: "sortBy",
                  "hx-on:change":
                    `htmx.trigger(this.closest('form'), 'submit')`,
                  id: "sortBy",
                }}
              />
              <Selector
                placeholder="Filtrar Por:"
                selectProps={{
                  name: "filterBy",
                  id: "filterBy",
                  "hx-on:change":
                    `htmx.trigger(this.closest('form'), 'submit')`,
                }}
                values={props.data.currentFilters.filterBy}
              />
            </div>
            {props.data.review.map((review) => (
              <div class="flex flex-col gap-5 mt-9">
                <h3 class="text-xs leading-[18px] font-bold text-[#353535]">
                  {review.name}
                </h3>
                <ProductRating
                  averageRating={review.reviewRating?.ratingValue ?? 0}
                  maxRating={5}
                  iconSize={18}
                  class="gap-1.5"
                />
                <p class="text-xs leading-[18px] font-bold text-[#353535]">
                  Enviado {formattedDate(review.datePublished ?? "")} atrás por
                  {" "}
                  {review.author?.[0].name}
                </p>
                <p class="text-xs leading-[18px] text-[#353535]">
                  {review.description}
                </p>
              </div>
            ))}
            {hasReviews
              ? (
                <div class="flex justify-end items-center gap-9 mt-5">
                  <span class="text-base text-[#676767]">
                    Mostrando {props.data.currentPage} de{" "}
                    {props.data.totalPages}
                  </span>
                  <div class="flex gap-5">
                    <Button
                      disabled={props.data.currentPage === 1}
                      styleType={ButtonType.Tertiary}
                      class="h-10 w-10 max-h-10 min-h-10 p-0 flex items-center justify-center"
                      type="submit"
                      name="operation"
                      value="previous"
                    >
                      <Icon id="chevron-left" size={18} />
                    </Button>
                    <Button
                      styleType={ButtonType.Tertiary}
                      disabled={props.data.currentPage ===
                        props.data.totalPages}
                      class="h-10 w-10 max-h-10 min-h-10 p-0 flex items-center justify-center"
                      type="submit"
                      name="operation"
                      value="next"
                    >
                      <Icon id="chevron-right" size={18} />
                    </Button>
                  </div>
                </div>
              )
              : (
                <p class="text-xs leading-[18px] font-bold text-[#353535] mt-5">
                  Não há avaliações!
                </p>
              )}
          </form>
        </div>
      </div>
      <Spacer />
    </>
  );
}

export function LoadingFallback() {
  return (
    <>
      <Spacer />
      <div class="bg-secondary-content h-[600px] flex items-center justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
      <Spacer />
    </>
  );
}
