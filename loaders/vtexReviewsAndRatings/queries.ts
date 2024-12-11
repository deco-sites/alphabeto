export const GetReviewsQuery = `
query GetReviews(
  $productId: String!, 
  $rating: Int,
	$locale: String,
  $pastReviews: Boolean,
  $from: Int,
  $to: Int,
  $orderBy: String,
  $status:String
){
  reviewsByProductId(
    productId:$productId,
    rating:$rating,
    locale: $locale,
    pastReviews: $pastReviews,
    from:$from,
    to:$to,
    orderBy:$orderBy,
    status:$status
  ) {
    data {
      id,
      title,
      reviewerName,
      reviewDateTime,
      rating,
      text,
    }
    range {
      total,
      from,
      to
    }
	}
}
`;

export const GetAverageRatingQuery = `
query GetAverageRating(
  $productId: String!, 
){
  averageRatingByProductId(
    productId:$productId,
  ) {
    average,
    total
	}
}
`;
