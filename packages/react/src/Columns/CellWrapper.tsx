import type { PropsWithChildren } from "react";

export type CellWrapper<T> = PropsWithChildren<{ value?: T }>;

export function CellWrapper<T>({ children, value }: CellWrapper<T>) {
  if (value === undefined) return "N/A";

  return children;
}
