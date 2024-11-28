"use client";
import { useAuth } from "../providers";
import { HasPermission } from "./HasPermission";

export type HasAdminPermission = Omit<
  HasPermission,
  "hasAccess" | "isNotInitialized"
>;

export function HasAdminPermission(props: HasAdminPermission) {
  const { profile, isProfileLoading, isProfileError } = useAuth();

  const { dev, superuser } = profile ?? {};

  return (
    <HasPermission
      {...props}
      hasAccess={dev || superuser}
      isNotInitialized={!profile || isProfileLoading || isProfileError}
    />
  );
}
