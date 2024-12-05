"use client";
import { useAuth } from "../providers";
import { HasPermission } from "./HasPermission";

export type HasStaffPermission = Omit<
  HasPermission,
  "hasAccess" | "isNotInitialized"
>;

export function HasStaffPermission(props: HasStaffPermission) {
  const { profile, isProfileLoading, isProfileError } = useAuth();

  const { dev, superuser, staff } = profile ?? {};

  return (
    <HasPermission
      {...props}
      hasAccess={dev || superuser || staff}
      isNotInitialized={!profile || isProfileLoading || isProfileError}
    />
  );
}
