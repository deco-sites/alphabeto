import { AppContext } from "site/apps/deco/vtex.ts";
import type { Document } from "apps/vtex/utils/types.ts";
interface Props {
	/**
	 * @description Two-letter string that identifies the data entity.
	 */
	acronym: string;
	/**
	 * @description Names of the fields that will be returned per document, separated by a comma ,. It is possible to fetch all fields using _all as the value of this query parameter. However, in order to avoid permission errors, we strongly recommend informing only the names of the exact fields that will be used.
	 */
	fields?: string;
	/**
	 * @description Specification of filters.
	 */
	where?: string;
	/**
	 * @description Inform a field name plus ASC to sort results by this field value in ascending order or DESC to sort by descending order.
	 */
	sort?: string;
	/**
	 * @description Number of documents to be returned.
	 * @default 10
	 * @maxValue 100
	 * @minValue 1
	 */
	take?: number;
	/**
	 * @description Skip how many documents
	 * @default 0
	 * @maxValue 100
	 * @minValue 0
	 */
	skip?: number;
}

export function resourceRange(
  skip: number,
  take: number,
) {
  const from = Math.max(skip, 0);
  const to = from + take;

  return {
    from,
    to,
  };
}


/**
 * @title Search documents - VTEX
 * @docs https://developers.vtex.com/docs/api-reference/masterdata-api#get-/api/dataentities/-acronym-/search
 */
export default async function loader(
	props: Props,
	_req: Request,
	_ctx: AppContext,
): Promise<Document[]> {
	const { acronym, fields, where, sort, skip = 0, take = 10 } = props;
	const limits = resourceRange(skip, take);

	const url = new URL(
		`https://alphabeto.vtexcommercestable.com.br/api/dataentities/${acronym}/search`,
	);
	if (fields) url.searchParams.append("_fields", fields);
	if (where) url.searchParams.append("_where", where);
	if (sort) url.searchParams.append("_sort", sort);

	const documents = await fetch(
		url.href,
		{
			headers: {
				accept: "application/vnd.vtex.ds.v10+json",
				"content-type": "application/json",
				"REST-Range": `resources=${limits.from}-${limits.to}`,
			},
		},
	).then((res) => res.json());

	return documents;
}