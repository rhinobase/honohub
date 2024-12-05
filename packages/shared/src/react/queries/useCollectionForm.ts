"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { CollectionFieldType } from "../types";
import { endpoint } from "../utils";

const getCollectionFormQueryKey = (options: {
  org: string | string[];
  col: string | string[];
}) => ["organisations", options.org, "collections", options.col, "fields"];

export function useCollectionForm() {
  const { org, col } = useParams();
  const queryKey = getCollectionFormQueryKey({ col, org });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<CollectionFieldType>(
          `organisations/${org}/collections/${col}/fields`,
          {
            signal,
          },
        )
        .then((res) => res.data),
    enabled: org !== undefined && col !== undefined,
  });
}
