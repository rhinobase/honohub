"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import pluralize from "pluralize";
import type { CollectionType } from "../types";
import { endpoint } from "../utils";

const getAllCollectionsQueryKey = (options: { org: string | string[] }) => [
  "organisations",
  options.org,
  "collections",
];

export function useAllCollections() {
  const { org } = useParams();

  const queryKey = getAllCollectionsQueryKey({ org });

  return useQuery<CollectionType[]>({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<(Omit<CollectionType, "name"> & { name: string })[]>(
          `organisations/${org}/collections`,
          {
            signal,
            params: { order: 1 },
          },
        )
        .then((res) =>
          res.data?.map((collection) => ({
            ...collection,
            name: {
              singular: collection.name,
              plural: collection.preview?.list
                ? collection.name
                : pluralize(collection.name),
            },
          })),
        ),
    enabled: !!org,
  });
}
