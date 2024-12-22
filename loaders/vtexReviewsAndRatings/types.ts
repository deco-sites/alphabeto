export interface GetReviewsQueryResponse {
  reviewsByProductId: {
    data: {
      id: string;
      title: string;
      reviewerName: string;
      reviewDateTime: string;
      rating: number;
      text: string;
    }[];
    range: {
      total: number;
      from: number;
      to: number;
    };
  };
}
export interface GetReviewsQueryVariables {
  productId: string;
  rating: number;
  locale: string;
  from: number;
  pastReviews: boolean;
  to: number;
  orderBy: string;
  status: string;
}

export interface GetAverageRatingQueryVariables {
  productId: string;
}

export interface GetAverageRatingQueryResponse {
  averageRatingByProductId: {
    average: number;
    total: number;
  };
}
