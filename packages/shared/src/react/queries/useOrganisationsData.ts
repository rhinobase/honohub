"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import type z from "zod";
import { useQueryParams } from "../hooks";
import { useAuth } from "../providers/auth";
import type { OrganizationType } from "../types";
import { endpoint } from "../utils";
import { baseQueryValidation } from "../validations";

export const getOrganisationsQueryKey = (
  options?: z.infer<typeof baseQueryValidation>,
) =>
  ["organisations", options?.search, options?.order, options?.orderBy].filter(
    (val) => val != null,
  );

export function useOrganisationsData() {
  const { profile } = useAuth();
  const pathname = usePathname();

  const queryParams = useQueryParams(baseQueryValidation);

  const orgSearch = pathname === "/" ? queryParams.search : "";

  const queryKey = getOrganisationsQueryKey({
    ...queryParams,
    search: orgSearch,
  });

  return useQuery<OrganizationType[]>({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get("/user/organisations", {
          signal,
          params: queryParams,
        })
        .then((res) => res.data),
    enabled: !!profile,
  });
}
