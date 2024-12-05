"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import type { PaginatedResponse } from "../types";
import { StaticCollection, endpoint } from "../utils";
import { queryValidation, userQueryValidation } from "../validations";

type GetManageQueryKeyOptions = {
  org: string | string[];
} & (
  | { slug: StaticCollection.ROLES; params: z.infer<typeof queryValidation> }
  | {
      slug: StaticCollection.USERS;
      params: z.infer<typeof userQueryValidation>;
    }
);

export const getManageQueryKey = (options: GetManageQueryKeyOptions) => {
  const { org, slug, params } = options;

  const keys: unknown[] = [
    "organisations",
    org,
    "manage",
    slug,
    params.limit,
    params.offset,
    params.search,
    params.order,
    params.orderBy,
  ];

  if (slug === StaticCollection.USERS)
    keys.push(params.superuser, params.staff, params.disabled, params.role);

  return [...keys.filter(Boolean)];
};

export function useManageData(options: Pick<GetManageQueryKeyOptions, "slug">) {
  const { org } = useParams();
  const { slug } = options;

  let validationSchema = queryValidation;

  if (slug === "users") validationSchema = userQueryValidation;

  const params = useQueryParams(validationSchema);

  const queryKey = getManageQueryKey({
    org,
    slug,
    params,
  });

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<PaginatedResponse>(`organisations/${org}/manage/${slug}`, {
          signal,
          params,
        })
        .then((res) => res.data),
    enabled: !!slug,
  });
}
