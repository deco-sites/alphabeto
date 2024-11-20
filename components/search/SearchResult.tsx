import { type SectionProps } from "@deco/deco";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "site/components/product/ProductCard.tsx";
import CategoryBanner, {
  Props as BannerProps,
} from "site/components/search/CategoryBanner.tsx";
import Filters from "site/components/search/Filters.tsx";
import SortDesktop from "site/components/search/Sort/SortDesktop.tsx";
import SortMobile from "site/components/search/Sort/SortMobile.tsx";
import Breadcrumb, {
  BreadcrumbOverride,
} from "site/components/ui/Breadcrumb.tsx";
import Drawer from "site/components/ui/Drawer/index.tsx";
import Icon from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";
import { useId } from "site/sdk/useId.ts";
import { useOffer } from "site/sdk/useOffer.ts";
import { useSendEvent } from "site/sdk/useSendEvent.ts";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}
export interface Props {
  /**
   * @title SEO Settings
   * @description The SEO Settings for this page
   */
  seo: {
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

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
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

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
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
        <a
          rel="prev"
          class="btn btn-ghost"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">Show Less</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "desk:grid-cols-4 desk:gap-10",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full min-w-[160px] max-w-[300px]"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">Show More</span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
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
  const results = (
    <span class="text-sm font-normal">
      {page.pageInfo.recordPerPage} of {page.pageInfo.records} results
    </span>
  );
  const SortBy = () => {
    if (sortOptions.length === 0) return null;
    if (device === "desktop") {
      return <SortDesktop sortOptions={sortOptions} url={url} />;
    } else return <SortMobile sortOptions={sortOptions} url={url} />;
  };

  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-5 desk:gap-5 w-full py-5 px-5">
              <Breadcrumb
                itemListElement={breadcrumb?.itemListElement}
                breadcrumbOverride={props.seo.breadcrumb}
              />

              {props.seo.banner && <CategoryBanner {...props.seo.banner} />}

              {device === "mobile" && (
                <Drawer
                  id={controls}
                  aside={
                    <div class="bg-base-100 flex flex-col h-full divide-y overflow-y-hidden">
                      <div class="flex justify-between items-center">
                        <h1 class="px-4 py-3">
                          <span class="font-medium text-2xl">Filters</span>
                        </h1>
                        <label class="btn btn-ghost" for={controls}>
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <Filters filters={filters} />
                      </div>
                    </div>
                  }
                >
                  <div class="flex sm:hidden justify-between items-end">
                    <div class="flex flex-col">
                      {results}
                      <SortBy />
                    </div>

                    <label class="btn btn-ghost" for={controls}>
                      Filters
                    </label>
                  </div>
                </Drawer>
              )}

              <div class="grid place-items-center grid-cols-1 desk:grid-cols-[265px_1fr] desk:gap-20 mt-5">
                {device === "desktop" && (
                  <aside class="place-self-start flex flex-col gap-9">
                    <div>
                      <SortBy />
                    </div>
                    <Filters filters={filters} />
                  </aside>
                )}

                <div class="flex flex-col gap-9">
                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>

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
function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}

export default SearchResult;
