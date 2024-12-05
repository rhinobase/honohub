"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { PaginatedResponse, ReferenceType } from "../types";
import { endpoint } from "../utils";
import { referenceQueryValidation } from "../validations";

const PAGE_SIZE = 10;

const getManageRoleReferenceDataQueryKey = (
  options: {
    org: string | string[];
    search?: string;
  } & z.infer<typeof referenceQueryValidation>,
) =>
  [
    "organisations",
    options.org,
    "manage",
    "roles",
    "reference",
    options.search,
    options.order,
    options.orderBy,
  ].filter((val) => val != null);

export function useManageRoleReferenceTypeData(
  options: { search?: string } = {},
) {
  const { org } = useParams();
  const queryParams = useQueryParams(referenceQueryValidation);

  const queryKey = getManageRoleReferenceDataQueryKey({
    org,
    ...options,
    ...queryParams,
  });

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0, signal }) =>
      endpoint
        .get<PaginatedResponse<ReferenceType>>(
          `organisations/${org}/manage/roles/reference`,
          {
            signal,
            params: {
              ...options,
              ...queryParams,
              offset: pageParam * PAGE_SIZE,
            },
          },
        )
        .then((res) => res.data),
    getNextPageParam: (lastPage, pages) => {
      const count = pages.flatMap((page) => page.results).length;
      if (lastPage.count <= count) return undefined;
      return pages.length;
    },
    initialPageParam: 0,
  });
}
