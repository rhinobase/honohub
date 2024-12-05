"use client";
import type { Profile } from "../types";
import { endpoint } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export const getProfileQueryKey = () => ["profile"];

export function useProfile() {
  const auth = getAuth();
  const queryKey = getProfileQueryKey();

  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      endpoint
        .get<Profile>("/user", {
          signal,
        })
        .then((res) => res.data),
    enabled: auth.currentUser != null,
  });
}
