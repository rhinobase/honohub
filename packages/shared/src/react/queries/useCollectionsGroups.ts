"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { CollectionsGroupType } from "../types";
import { endpoint } from "../utils";

const getCollectionsGroupsQueryKey = (options: { org: string | string[] }) => [
  "organisations",
  options.org,
  "groups",
];

export function useCollectionsGroups() {
  const { org } = useParams();
  const queryKey = getCollectionsGroupsQueryKey({ org });

  return useQuery<CollectionsGroupType[]>({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get(`organisations/${org}/groups`, {
          signal,
        })
        .then((res) => res.data),
    enabled: !!org,
  });
}
