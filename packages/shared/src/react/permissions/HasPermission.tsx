"use client";
import type { PropsWithChildren, ReactNode } from "react";
import { ErrorComponent } from "../../shared";

export type HasPermission = PropsWithChildren<{
  hasAccess?: boolean;
  showError?: boolean;
  errorMessage?: ReactNode;
  isNotInitialized: boolean;
}>;

export function HasPermission({
  children,
  hasAccess,
  showError,
  errorMessage,
  isNotInitialized,
}: HasPermission) {
  if (isNotInitialized || hasAccess !== false) return children;

  if (showError)
    return (
      <ErrorComponent>
        {errorMessage ?? "You don't have access to this page"}
      </ErrorComponent>
    );
}
