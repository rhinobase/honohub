"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { PaginatedResponse } from "../types";
import { endpoint } from "../utils";
import { queryValidationWithFields } from "../validations";

export const getCollectionQueryKey = ({
  org,
  col,
  limit,
  offset,
  ...options
}: { org: string | string[]; col: string | string[] } & z.infer<
  typeof queryValidationWithFields
>) => {
  const keys: unknown[] = [
    "organisations",
    org,
    "collections",
    col,
    limit,
    offset,
  ];

  Object.values(options).map((item) => {
    if (item) keys.push(item);
  });

  return keys;
};

export function useCollectionData() {
  const { org, col } = useParams();
  const queryParams = useQueryParams(queryValidationWithFields.passthrough());

  const queryKey = getCollectionQueryKey({
    org,
    col,
    ...queryParams,
  });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<PaginatedResponse>(`organisations/${org}/collections/${col}`, {
          signal,
          params: queryParams,
        })
        .then((res) => res.data),
    enabled: !!col,
  });
}
