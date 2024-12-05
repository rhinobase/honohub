"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { endpoint } from "../utils";

const getCollectionActionsQueryKey = (options: {
  org: string | string[];
  col: string | string[];
}) => ["organisations", options.org, "collections", options.col, "actions"];

export function useCollectionActions(actionApiUrl: string) {
  const { org, col } = useParams();
  const queryKey = getCollectionActionsQueryKey({ col, org });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<
          {
            name: string;
            icon: string;
            label: string;
            level?: boolean | { title: string; message: string };
          }[]
        >(actionApiUrl, {
          signal,
        })
        .then((res) => res.data),
  });
}
