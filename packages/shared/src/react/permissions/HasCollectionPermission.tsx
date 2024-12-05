"use client";
import { useCollection } from "../providers";
import { HasPermission } from "./HasPermission";

export type HasCollectionPermission = Omit<
  HasPermission,
  "hasAccess" | "isNotInitialized"
>;

export function HasCollectionPermission({
  errorMessage = "You don't have access to this collection",
  ...props
}: HasCollectionPermission) {
  const { current, collections, isLoading, isError } = useCollection();

  return (
    <HasPermission
      {...props}
      hasAccess={collections && current != null}
      errorMessage={errorMessage}
      isNotInitialized={!collections || !current || isLoading || isError}
    />
  );
}
