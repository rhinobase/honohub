"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { History } from "../types";
import { endpoint } from "../utils";
import { collectionDocumentHistoryQueryValidation } from "../validations";

const getCollectionDocumentHistoryQueryKey = (
  options: {
    org: string | string[];
    col: string | string[];
    id: string | string[];
  } & z.infer<typeof collectionDocumentHistoryQueryValidation>,
) =>
  [
    "organisations",
    options.org,
    "collections",
    options.col,
    options.id,
    "history",
    options.limit,
    options.offset,
    options.order,
    options.orderBy,
  ].filter((val) => val != null);

export function useCollectionDocumentHistory() {
  const { org, col, id } = useParams();
  const queryParams = useQueryParams(collectionDocumentHistoryQueryValidation);

  const queryKey = getCollectionDocumentHistoryQueryKey({
    col,
    id,
    org,
    ...queryParams,
  });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<History[]>(
          `organisations/${org}/collections/${col}/${id}/history`,
          { signal, params: queryParams },
        )
        .then((res) => res.data),
  });
}
