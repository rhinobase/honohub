"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { endpoint } from "../utils";

const getCollectionIndexesQueryKey = (options: {
  org: string | string[];
  col: string | string[];
}) => ["organisations", options.org, "collections", options.col, "indexes"];

export function useCollectionIndexesData() {
  const { org, col } = useParams();

  const queryKey = getCollectionIndexesQueryKey({ org, col });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<Record<string, unknown>[]>(
          `/organisations/${org}/collections/${col}/dev/indexes`,
          {
            signal,
          },
        )
        .then((res) => res.data),
  });
}
