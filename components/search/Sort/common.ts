import { ProductListingPage } from "apps/commerce/types.ts";
import { AvailableIcons } from "site/components/ui/Icon.tsx";

export type Props = Pick<ProductListingPage, "sortOptions"> & {
    url: string;
};

const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";

export const getUrl = (href: string, value: string) => {
    const url = new URL(href);
    url.searchParams.delete(PAGE_QUERY_PARAM);
    url.searchParams.set(SORT_QUERY_PARAM, value);
    return url.href;
};

export type Sorts =
    | "relevance:desc"
    | "price:desc"
    | "price:asc"
    | "orders:desc"
    | "name:desc"
    | "name:asc"
    | "release:desc"
    | "discount:desc";

export const labels: Record<Sorts, string> = {
    "relevance:desc": "Relevância",
    "price:desc": "Maior Preço",
    "price:asc": "Menor Preço",
    "orders:desc": "Mais vendidos",
    "name:desc": "Nome - de Z a A",
    "name:asc": "Nome - de A a Z",
    "release:desc": "Data de lançamento",
    "discount:desc": "Maior desconto",
};

export const icons: Record<Sorts, AvailableIcons> = {
    "relevance:desc": "cat_sort_relevance:desc",
    "discount:desc": "cat_sort_discount:desc",
    "price:desc": "cat_sort_price:desc",
    "price:asc": "cat_sort_price:asc",
    "orders:desc": "cat_sort_orders:desc",
    "name:desc": "cat_sort_name:desc",
    "name:asc": "cat_sort_name:asc",
    "release:desc": "cat_sort_release:desc",
};

export const order: Sorts[] = [
    "orders:desc",
    "price:asc",
    "price:desc",
    "discount:desc",
    "release:desc",
    "relevance:desc",
    "name:asc",
    "name:desc",
];

export const optionsToHide: Sorts[] = [];

export const useSortData = (props: Props) => {
    const { sortOptions, url } = props;
    const current = getUrl(
        url,
        new URL(url).searchParams.get(SORT_QUERY_PARAM) ?? "",
    );
    const options = sortOptions?.map(({ value, label }) => ({
        value: getUrl(url, value),
        label,
        textLabel: labels[label as Sorts],
        icon: icons[label as Sorts],
        isCurrent: current === getUrl(url, value),
    })).sort((a, b) =>
        order.indexOf(a.label as Sorts) - order.indexOf(b.label as Sorts)
    ).filter(({ label }) => !optionsToHide.includes(label as Sorts));

    return { options, current };
};
