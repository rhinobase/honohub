"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { PaginatedResponse } from "../types";
import { endpoint } from "../utils";
import type {
  collectionActionValidation,
  queryValidation,
} from "../validations";

export const getCollectionActionsQueryKey = (
  options: z.infer<typeof queryValidation> & {
    org: string | string[];
    col: string | string[];
  },
) => {
  const key = [
    "organisations",
    options.org,
    "collections",
    options.col,
    "actions",
    options.limit,
    options.offset,
  ];

  if (options.search) key.push(options.search);
  if (options.order) key.push(options.order);
  if (options.orderBy) key.push(options.orderBy);

  return key;
};

export function useCollectionActionsData() {
  const { org, col } = useParams();
  const queryParams = useQueryParams();

  const queryKey = getCollectionActionsQueryKey({ org, col, ...queryParams });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<PaginatedResponse<z.infer<typeof collectionActionValidation>>>(
          `/organisations/${org}/collections/${col}/dev/actions`,
          {
            signal,
            params: queryParams,
          },
        )
        .then((res) => res.data),
  });
}
