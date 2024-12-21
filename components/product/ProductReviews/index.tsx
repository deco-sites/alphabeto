import { useScript } from "@deco/deco/hooks";
import { Review } from "apps/commerce/types.ts";
import dayjs from "https://cdn.skypack.dev/dayjs";
import "https://cdn.skypack.dev/dayjs/locale/pt-br";
import relativeTime from "https://cdn.skypack.dev/dayjs/plugin/relativeTime";
import updateLocale from "https://cdn.skypack.dev/dayjs/plugin/updateLocale";
import Selector from "site/components/product/ProductBuyTogether/Selector.tsx";
import ProductRating from "site/components/product/ProductRating.tsx";
import ReviewForm, {
  REVIEW_FORM_CONTAINER_ID,
} from "site/components/product/ProductReviews/ReviewForm.tsx";
import Button, { ButtonType } from "site/components/ui/Button.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { VtexReviewsLoader } from "site/loaders/vtexReviewsAndRatings/index.ts";
import { useId } from "site/sdk/useId.ts";
import { useComponent } from "site/sections/Component.tsx";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";
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

const submitFilterForm = () => {
  const form = document.querySelector<HTMLFormElement>("#filter-form-review");
  if (!form) return;
  const url = new URL(form.getAttribute("hx-get") ?? "", window.location.href);
  const props = JSON.parse(
    decodeURIComponent(url.searchParams.get("props") ?? ""),
  );
  props.props.reloadSettings.filterBy = form.querySelector<HTMLSelectElement>(
    "#filterBy",
  )?.value;
  props.props.reloadSettings.sortBy = form.querySelector<HTMLSelectElement>(
    "#sortBy",
  )?.value;
  url.searchParams.set("props", JSON.stringify(props));
  form.setAttribute("hx-get", url.href);
  htmx.process(form);
  document
    .querySelector<HTMLButtonElement>(
      "#filter-form-review button[type='submit']",
    )
    ?.click();
};

export default function ProductReviews(props: Props) {
  const hasReviews = props.data.review.length > 0;
  const formattedDate = (date: string) => dayjs(date).locale("pt-BR").fromNow();
  const currentFilterValue =
    props.data.currentFilters.filterBy.find((filter) => filter.selected)
      ?.value ?? "";
  const currentSortValue =
    props.data.currentFilters.sortBy.find((filter) => filter.selected)?.value ??
      "";
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
          <div class="mt-9 border-t-secondary border-t">
            <form
              class="grid gap-[30px] grid-cols-[167px_112px] mt-9"
              hx-target="closest section"
              hx-swap="outerHTML"
              hx-indicator={`#${id}`}
              id="filter-form-review"
              hx-get={useComponent<VtexReviewsLoader>(Reload, {
                page: null,
                reloadSettings: {
                  actualPage: String(1),
                  filterBy: "",
                  productID: props.data.productId,
                  sortBy: "",
                },
              })}
            >
              <Selector
                placeholder="Ordernar Por:"
                values={props.data.currentFilters.sortBy}
                selectProps={{
                  name: "sortBy",
                  "hx-on:change": useScript(submitFilterForm),
                  id: "sortBy",
                }}
              />
              <Selector
                placeholder="Filtrar Por:"
                selectProps={{
                  name: "filterBy",
                  "hx-on:change": useScript(submitFilterForm),
                  id: "filterBy",
                }}
                values={props.data.currentFilters.filterBy}
              />
              <button type="submit" class="hidden" />
            </form>
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
                      hx-target="closest section"
                      hx-indicator={`#${id}`}
                      hx-swap="outerHTML"
                      hx-get={useComponent<VtexReviewsLoader>(Reload, {
                        page: null,
                        reloadSettings: {
                          actualPage: String(props.data.currentPage - 1),
                          filterBy: currentFilterValue,
                          productID: props.data.productId,
                          sortBy: currentSortValue,
                        },
                      })}
                      styleType={ButtonType.Tertiary}
                      class="h-10 w-10 max-h-10 min-h-10 p-0 flex items-center justify-center"
                    >
                      <Icon id="chevron-left" size={18} />
                    </Button>
                    <Button
                      disabled={props.data.currentPage ===
                        props.data.totalPages}
                      hx-target="closest section"
                      hx-indicator={`#${id}`}
                      hx-swap="outerHTML"
                      hx-get={useComponent<VtexReviewsLoader>(Reload, {
                        page: null,
                        reloadSettings: {
                          actualPage: String(props.data.currentPage + 1),
                          filterBy: currentFilterValue,
                          productID: props.data.productId,
                          sortBy: currentSortValue,
                        },
                      })}
                      styleType={ButtonType.Tertiary}
                      class="h-10 w-10 max-h-10 min-h-10 p-0 flex items-center justify-center"
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
          </div>
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
