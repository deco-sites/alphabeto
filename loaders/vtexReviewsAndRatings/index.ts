import { ProductDetailsPage, Review } from "apps/commerce/types.ts";
import { AppContext } from "site/apps/deco/vtex.ts";
import { ProductReviewsData } from "site/components/product/ProductReviews/index.tsx";
import {
  FILTER_BY_OPTIONS,
  PAGE_SIZE,
  SORT_BY_OPTIONS,
} from "site/loaders/vtexReviewsAndRatings/constants.ts";
import {
  GetAverageRatingQuery,
  GetReviewsQuery,
} from "site/loaders/vtexReviewsAndRatings/queries.ts";
import {
  GetAverageRatingQueryResponse,
  GetAverageRatingQueryVariables,
  GetReviewsQueryResponse,
  GetReviewsQueryVariables,
} from "site/loaders/vtexReviewsAndRatings/types.ts";

/**
 * @hide
 */
interface ReloadSettings {
  filterBy: string;
  sortBy: string;
  actualPage: string;
  productID: string;
}

export interface VtexReviewsLoader {
  page: ProductDetailsPage | null;
  reloadSettings?: ReloadSettings;
}

export default async function loader(
  props: VtexReviewsLoader,
  _req: Request,
  ctx: AppContext,
): Promise<ProductReviewsData> {
  const { io } = await ctx.invoke.vtex.loaders.config();
  const filterBy = props.reloadSettings?.filterBy || "0";
  const sortBy = props.reloadSettings?.sortBy || "SearchDate:desc";
  const actualPage = props.reloadSettings?.actualPage || "1";
  const fromPage = (Number(actualPage) - 1) * (PAGE_SIZE - 1);
  const toPage = fromPage + (PAGE_SIZE - 1);
  const productId = props.page?.product.isVariantOf?.productGroupID ||
    props.reloadSettings?.productID;

  const preparetedFilterBy = FILTER_BY_OPTIONS.map((option) => ({
    ...option,
    selected: option.value === filterBy,
  }));

  const preparetedSortBy = SORT_BY_OPTIONS.map((option) => ({
    ...option,
    selected: option.value === sortBy,
  }));
  const preparetedCurrentFilters = {
    filterBy: preparetedFilterBy,
    sortBy: preparetedSortBy,
  };
  if (!productId) {
    return {
      productId: "",
      totalReviews: 0,
      averageRating: 0,
      currentFilters: preparetedCurrentFilters,
      currentPage: 1,
      review: [],
      totalPages: 0,
    };
  }

  const getAverageRatingResponse = await io.query<
    GetAverageRatingQueryResponse,
    GetAverageRatingQueryVariables
  >({
    query: GetAverageRatingQuery,
    variables: { productId },
  });

  if (getAverageRatingResponse.averageRatingByProductId.total === 0) {
    return {
      productId: productId,
      totalReviews: 0,
      averageRating: 0,
      currentFilters: preparetedCurrentFilters,
      currentPage: 1,
      review: [],
      totalPages: 0,
    };
  }

  const getReviewsVariables: GetReviewsQueryVariables = {
    productId,
    rating: Number(filterBy),
    locale: "pt",
    from: Number(fromPage),
    to: Number(toPage),
    orderBy: sortBy,
    status: "true",
    pastReviews: true,
  };
  const getReviewsResponse = await io.query<
    GetReviewsQueryResponse,
    GetReviewsQueryVariables
  >({
    query: GetReviewsQuery,
    variables: getReviewsVariables,
  });
  const reviews: Review[] = getReviewsResponse.reviewsByProductId.data.map((
    review,
  ) => ({
    "@type": "Review",
    "@id": review.id,
    author: [{
      "@type": "Author",
      "@id": review.reviewerName,
      name: review.reviewerName,
    }],
    datePublished: review.reviewDateTime,
    id: review.id,
    name: review.title,
    description: review.text,
    reviewRating: {
      "@type": "AggregateRating",
      ratingValue: review.rating,
    },
  }));

  return {
    productId: productId,
    averageRating: getAverageRatingResponse.averageRatingByProductId.average,
    totalReviews: getAverageRatingResponse.averageRatingByProductId.total,
    currentFilters: preparetedCurrentFilters,
    currentPage: Number(actualPage),
    review: reviews,
    totalPages: Math.ceil(
      getReviewsResponse.reviewsByProductId.range.total / PAGE_SIZE,
    ),
  };
}
