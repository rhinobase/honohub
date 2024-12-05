"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { getOrganisationsQueryKey, useOrganisationsData } from "../queries";
import type { OrganizationType } from "../types";
import { useAuth } from "./auth";

const OrganizationContext = createContext<ReturnType<
  typeof useOrganizationManager
> | null>(null);

export function OrganizationProvider({ children }: PropsWithChildren) {
  const value = useOrganizationManager();

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganizationManager() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const currentSlug = params.org;

  const { data: organisations, ...props } = useOrganisationsData();

  const [organisationMap, defaultSlug] = useMemo(() => {
    let defaultSlug: string | undefined = undefined;

    let organisationMap: Record<string, OrganizationType> = {};

    if (organisations)
      organisationMap = organisations.reduce((prev, cur) => {
        prev[cur.slug] = cur;

        if (profile?.preferences?.organisation === cur._id)
          defaultSlug = cur.slug;

        return prev;
      }, organisationMap);

    return [organisationMap, defaultSlug];
  }, [organisations, profile]);

  const queryKey = getOrganisationsQueryKey();

  useEffect(() => {
    if (!profile && organisations)
      queryClient.removeQueries({
        queryKey,
      });
  }, [organisations, profile, queryClient, queryKey]);

  return {
    organisations,
    current: currentSlug ? organisationMap[String(currentSlug)] : null,
    defaultOrganisation: defaultSlug ? organisationMap[defaultSlug] : null,
    ...props,
  };
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext);

  if (!context)
    throw new Error("Missing OrganizationContext.Provider in the tree!");

  return context;
};
