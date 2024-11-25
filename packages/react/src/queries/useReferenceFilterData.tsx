import { useInfiniteQuery } from "@tanstack/react-query";
import { useServer } from "../providers";
import type { PaginatedResponse, ReferenceType } from "../types";

const PAGE_SIZE = 10;

const getReferenceFilterDataQueryKey = (options: {
  slug: string;
  search?: string;
}) =>
  ["collections", options.slug, "reference", options.search].filter(
    (val) => val != null,
  );

export function useReferenceFilterData(options: {
  search?: string;
  slug: string;
}) {
  const { endpoint } = useServer();
  const queryKey = getReferenceFilterDataQueryKey({ ...options });

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0, signal }) =>
      endpoint
        .get<PaginatedResponse<ReferenceType>>(
          `/collections/${options.slug}/reference`,
          {
            signal,
            params: {
              search: options.search,
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
