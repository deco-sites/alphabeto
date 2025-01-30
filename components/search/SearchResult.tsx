import { type SectionProps } from "@deco/deco";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import type { FilterToggle, ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { AppContext } from "site/apps/site.ts";
import ProductCard from "site/components/product/ProductCard.tsx";
import CategoryBanner, {
  Props as BannerProps,
} from "site/components/search/CategoryBanner.tsx";
import AgeFilter from "site/components/search/Filters/AgeFilter.tsx";
import Filters from "site/components/search/Filters/index.tsx";
import SortDesktop from "site/components/search/Sort/SortDesktop.tsx";
import SortMobile from "site/components/search/Sort/SortMobile.tsx";
import Breadcrumb, {
  BreadcrumbOverride,
} from "site/components/ui/Breadcrumb.tsx";
import {
  ButtonAnchor,
  ButtonType,
  TextStyles,
} from "site/components/ui/Button.tsx";
import Drawer from "site/components/ui/Drawer/index.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";
import Section from "site/components/ui/Section.tsx";

const AGE_FILTER_KEY = "tamanho";

export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
  /**
   * @title Enable Special	Filter
   * @description Enables special filter on top of search results
   */
  enableSpecialFilter?: boolean;
}
export interface Props {
  /**
   * @title SEO Settings
   * @description The SEO Settings for this page
   */
  seoComponents: {
    /** @title Banner Settings */
    banner?: BannerProps;
    /** @title Breadcrumb Override */
    breadcrumb?: BreadcrumbOverride[];
  };
  /** @title Visual Configuration */
  layout?: Layout;
  /** @title Integration to Ecommerce Plataform */
  page: ProductListingPage | null;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /**
   * @title Partial Otimization
   * @hide
   */
  partial?: "hideMore" | "hideLess";
}

export const loader = (props: Props, req: Request, app: AppContext) => {
  const siteSettings = {
    cashbackPercentage: app.globalSettings.cashbackPercentage,
    colors: app.globalSettings.colors,
  };
  let emptyRedirect = "/404";
  const urlObject = new URL(req.url);
  const query = urlObject.searchParams.get("q");
  if (query) {
    emptyRedirect = `/searchNotFound?q=${query}`;
  }
  return {
    ...props,
    url: req.url,
    siteSettings,
    emptyRedirect,
  };
};

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    temp.searchParams.forEach((value, key) => {
      final.searchParams.set(key, value);
    });
    url = final.href;
  }
  return url;
};

const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
function SearchNotFound(props: SectionProps<typeof loader>) {
  return (
    <>
      <LoadingFallback />
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript((page: string) => {
            window.location.href = page;
          }, props.emptyRedirect),
        }}
      />
    </>
  );
}

declare global {
  interface LozadOptions {
    rootMargin?: string;
    threshold?: number | number[];
    enableAutoReload?: boolean;
    loaded?: (el: Element) => void;
  }

  interface LozadObserver {
    observe(): void;
    triggerLoad(element: Element): void;
    observer: IntersectionObserver;
  }

  function lozad(selector?: string, options?: LozadOptions): LozadObserver;

  interface Window {
    lozad: typeof lozad;
  }
}

function lazyLoad() {
  const observer = lozad(); // lazy loads elements with default selector as '.lozad'
  observer.observe();
}

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial, siteSettings } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";
  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <ButtonAnchor
          rel="prev"
          styleType={ButtonType.Secondary}
          textStyles={TextStyles.Small}
          class={"border border-primary h-11"}
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">Ver anterior</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </ButtonAnchor>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2",
          "desk:grid-cols-3 gap-4",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full desk:w-[calc((100dvw_-_456px)/3)] max-w-[355px]"
            settings={siteSettings}
            lozad
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <ButtonAnchor
                rel="next"
                styleType={ButtonType.Secondary}
                textStyles={TextStyles.Small}
                class={clx(
                  "border border-primary h-11",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">Ver mais</span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </ButtonAnchor>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...useOffer(product.offers),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  const SortBy = () => {
    if (sortOptions.length === 0) return null;
    if (device === "desktop") {
      return <SortDesktop sortOptions={sortOptions} url={url} />;
    } else return <SortMobile sortOptions={sortOptions} url={url} />;
  };
  const filterSettings = {
    colors: props.siteSettings.colors ?? [],
  };

  const ageFilter = filters.find((filter) => filter.key === AGE_FILTER_KEY) as
    | FilterToggle
    | undefined;

  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-5 desk:gap-5 w-full pt-5 pb-20 desk:pb-[100px] px-5">
              <Breadcrumb
                itemListElement={breadcrumb?.itemListElement}
                breadcrumbOverride={props.seoComponents.breadcrumb}
              />

              {props.seoComponents.banner && (
                <CategoryBanner {...props.seoComponents.banner} />
              )}

              {device === "mobile" && (
                <Drawer
                  id={controls}
                  aside={
                    <Drawer.Aside
                      title="Filtro"
                      drawer={controls}
                      class="max-w-[calc(100vw_-_20px)]"
                    >
                      <div class="h-full flex flex-col bg-base-100 items-center justify-center border-none w-full">
                        <Filters
                          filters={filters}
                          settings={filterSettings}
                          url={url}
                        />
                      </div>
                    </Drawer.Aside>
                  }
                >
                  <div class="grid grid-cols-2">
                    <label
                      class="flex bg-secondary-content rounded-[4px_0px_0px_4px] text-xs font-bold leading-[18px] text-accent gap-2.5 h-10 items-center justify-center"
                      for={controls}
                    >
                      <Icon id="filter" size={16} className="text-primary" />
                      Filtros
                    </label>
                    <div class="flex flex-col">
                      <SortBy />
                    </div>
                  </div>
                </Drawer>
              )}

              <div class="grid grid-cols-1 desk:grid-cols-[265px_1fr] desk:gap-20">
                {device === "desktop" && (
                  <aside class="place-self-start flex flex-col gap-9">
                    <div>
                      <SortBy />
                    </div>
                    <Filters
                      filters={filters}
                      settings={filterSettings}
                      url={url}
                    />
                  </aside>
                )}

                <div class="flex flex-col gap-10">
                  {(ageFilter && props.layout?.enableSpecialFilter)
                    ? <AgeFilter filterToogle={ageFilter} url={url} />
                    : null}
                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(lazyLoad),
        }}
      />

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}
function SearchResult(props: SectionProps<typeof loader>) {
  const page = props.page;
  if (!page || !page.products || page.products.length === 0) {
    return <SearchNotFound {...props} />;
  }
  return <Result {...props} />;
}

export default SearchResult;
