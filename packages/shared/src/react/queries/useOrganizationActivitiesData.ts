"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { History, PaginatedResponse } from "../types";
import { endpoint } from "../utils";
import { activitiesQueryValidation } from "../validations";

const getOrganizationActivitiesQueryKey = (
  options: {
    org: string | string[];
  } & z.infer<typeof activitiesQueryValidation>,
) => {
  const key: unknown[] = [
    "organisations",
    options.org,
    "history",
    options.limit,
    options.offset,
  ];

  if (options.action) key.push(options.action.sort());
  if (options.collection) key.push(options.collection);
  if (options.user) key.push(options.user);
  if (options.order) key.push(options.order);
  if (options.orderBy) key.push(options.orderBy);

  return key;
};

export function useOrganizationActivitiesData(options?: {
  collectionId?: string[];
  userId?: string[];
  isEnable?: boolean;
}) {
  const { org } = useParams();

  const { user, collection, ...queryParams } = useQueryParams(
    activitiesQueryValidation,
  );

  const queryKey = getOrganizationActivitiesQueryKey({
    ...queryParams,
    org,
    collection: options?.collectionId ?? collection,
    user: options?.userId ?? user,
  });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<PaginatedResponse<History>>(`organisations/${org}/history`, {
          signal,
          params: {
            ...queryParams,
            collection: options?.collectionId ?? collection,
            user: options?.userId ?? user,
          },
        })
        .then((res) => res.data),
    enabled: options?.isEnable,
  });
}
