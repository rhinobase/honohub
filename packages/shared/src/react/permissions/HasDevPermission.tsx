"use client";
import { useAuth } from "../providers";
import { HasPermission } from "./HasPermission";

export type HasDevPermission = Omit<
  HasPermission,
  "hasAccess" | "isNotInitialized"
>;

export function HasDevPermission(props: HasDevPermission) {
  const { profile, isProfileError, isProfileLoading } = useAuth();

  return (
    <HasPermission
      {...props}
      hasAccess={profile?.dev}
      isNotInitialized={!profile || isProfileLoading || isProfileError}
    />
  );
}
