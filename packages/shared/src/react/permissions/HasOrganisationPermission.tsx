"use client";
import { useOrganization } from "../providers";
import { HasPermission } from "./HasPermission";

export type HasOrganisationPermission = Omit<
  HasPermission,
  "hasAccess" | "isNotInitialized"
>;

export function HasOrganisationPermission({
  errorMessage = "You don't have access to this organisation",
  ...props
}: HasOrganisationPermission) {
  const { current, organisations, isLoading, isError } = useOrganization();

  return (
    <HasPermission
      {...props}
      errorMessage={errorMessage}
      hasAccess={organisations && current != null}
      isNotInitialized={!organisations || !current || isLoading || isError}
    />
  );
}
