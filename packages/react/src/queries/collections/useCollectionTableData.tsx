import { useQuery } from "@tanstack/react-query";
import type z from "zod";
import { useQueryParams } from "../../hooks";
import { useServer } from "../../providers";
import type { PaginatedResponse } from "../../types";
import type { queryValidation } from "../../validations";

export const getCollectionTableQueryKey = (
  options: {
    slug: string;
  } & z.infer<typeof queryValidation>,
) =>
  [
    "collections",
    options.slug,
    options.limit,
    options.offset,
    options.search,
  ].filter((val) => val != null);

export function useCollectionTableData(options: { slug: string }) {
  const { endpoint } = useServer();

  const queryParams = useQueryParams();

  const queryKey = getCollectionTableQueryKey({
    slug: options.slug,
    ...queryParams,
  });

  return useQuery({
    queryKey,
    queryFn: () =>
      endpoint
        .get<PaginatedResponse>(`/collections/${options.slug}`, {
          params: queryParams,
        })
        .then((res) => res.data),
  });
}
