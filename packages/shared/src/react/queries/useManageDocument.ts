"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { type StaticCollection, endpoint } from "../utils";

export const getManageDocumentQueryKey = (options: {
  org: string | string[];
  id: string | string[];
  slug: string;
}) => ["organisations", options.org, "manage", options.slug, options.id];

export function useManageDocument(options: { slug: StaticCollection }) {
  const { id, org } = useParams();
  const { slug } = options;

  const queryKey = getManageDocumentQueryKey({ id, org, slug });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get(`organisations/${org}/manage/${slug}/${id}`, {
          signal,
        })
        .then((res) => res.data),
    enabled: org !== undefined && id !== undefined,
  });
}
