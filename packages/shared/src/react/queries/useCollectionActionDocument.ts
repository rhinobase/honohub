"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { endpoint } from "../utils";
import type { collectionActionValidation } from "../validations";

export const getCollectionActionDocumentQueryKey = (options: {
  org: string | string[];
  col: string | string[];
}) => ["organisations", options.org, "collections", options.col, "actions"];

export function useCollectionActionDocument() {
  const { org, col, id } = useParams();

  const queryKey = getCollectionActionDocumentQueryKey({ org, col });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<z.infer<typeof collectionActionValidation>>(
          `/organisations/${org}/collections/${col}/dev/actions/${id}`,
          {
            signal,
          },
        )
        .then((res) => res.data),
  });
}
