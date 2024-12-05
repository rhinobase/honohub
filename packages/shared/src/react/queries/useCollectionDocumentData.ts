"use client";
import { endpoint } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const getCollectionDocumentQueryKey = (options: {
  org: string | string[];
  col: string | string[];
  id: string | string[];
}) => ["organisations", options.org, "collections", options.col, options.id];

export function useCollectionDocumentData() {
  const { org, col, id } = useParams();
  const queryKey = getCollectionDocumentQueryKey({ org, col, id });

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return useQuery<Record<string, any>>({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get(`organisations/${org}/collections/${col}/${id}`, {
          signal,
        })
        .then((res) => res.data),
  });
}
