"use client";
import { useAuth, useCollection } from "../providers";
import type { CollectionPermission } from "../utils";
import { HasPermission } from "./HasPermission";

export type HasCrudPermission = {
  type: CollectionPermission | CollectionPermission[];
} & Omit<HasPermission, "hasAccess" | "isNotInitialized">;

export function HasCrudPermission({ type, ...props }: HasCrudPermission) {
  const { profile, isProfileError, isProfileLoading } = useAuth();
  const { current, collections, isError, isLoading } = useCollection();

  const { dev, superuser, permissions } = profile ?? {};

  let hasAccess = false;

  for (const perm of Array.isArray(type) ? type : [type]) {
    hasAccess = Boolean(permissions?.[current?.slug]?.[perm]);
    if (hasAccess) break;
  }

  return (
    <HasPermission
      {...props}
      hasAccess={dev || superuser || hasAccess}
      isNotInitialized={
        !profile ||
        isProfileLoading ||
        isProfileError ||
        !collections ||
        !current ||
        isLoading ||
        isError
      }
    />
  );
}
