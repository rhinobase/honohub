"use client";
import type { CellContext } from "@tanstack/react-table";
import { CellWrapper } from "./CellWrapper";

export function DateCell<T = unknown, U = unknown>({
  cell,
}: CellContext<T, U>) {
  const value = String(cell.getValue());

  return (
    <CellWrapper value={value}>
      <p>{new Date(value).toLocaleDateString()}</p>
    </CellWrapper>
  );
}
