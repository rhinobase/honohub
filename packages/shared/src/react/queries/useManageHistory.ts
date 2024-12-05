"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { History, PaginatedResponse } from "../types";
import { type StaticCollection, endpoint } from "../utils";

const getManageHistoryQueryKey = (options: {
  org: string | string[];
  id: string | string[];
  slug: string;
}) => [
  "organisations",
  options.org,
  "manage",
  options.slug,
  options.id,
  "history",
];

export function useManageHistory(options: { slug: StaticCollection }) {
  const { org, id } = useParams();
  const { slug } = options;
  const queryKey = getManageHistoryQueryKey({ id, org, slug });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<PaginatedResponse<History>>(
          `organisations/${org}/manage/${slug}/${id}/history`,
          {
            signal,
          },
        )
        .then((res) => res.data),
  });
}
