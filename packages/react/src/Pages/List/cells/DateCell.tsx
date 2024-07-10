"use client";
import { CellWrapper } from "./CellWrapper";

export function DateCell({ cell }: any) {
  const value = String(cell.getValue());

  return (
    <CellWrapper value={value}>
      <p>{new Date(value).toLocaleDateString()}</p>
    </CellWrapper>
  );
}
