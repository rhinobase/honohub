"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { endpoint } from "../utils";
import { queryValidation } from "../validations";

const PAGE_SIZE = 20;

export const getStorageQueryKey = (options: {
  org: string | string[];
  search?: string | undefined;
}) => {
  const key = ["spaces", options.org];

  if (options.search) key.push(options.search);

  return key;
};

export function useStorageData() {
  const { org } = useParams();
  const searchParams = useSearchParams();
  const { search } = queryValidation.parse(
    Object.fromEntries(searchParams.entries()),
  );

  const queryKey = getStorageQueryKey({ org, search });

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0, signal }) =>
      endpoint
        .get(`organisations/${org}/spaces`, {
          signal,
          params: { limit: PAGE_SIZE, offset: pageParam * PAGE_SIZE, search },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage, pages) => {
      const tmp = pages.flatMap((item) => item.results).length;
      if (lastPage.count > tmp) return pages.length;
    },
    enabled: !!org,
    initialPageParam: 0,
  });
}
