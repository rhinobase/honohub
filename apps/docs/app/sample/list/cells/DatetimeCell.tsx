"use client";
import { CellWrapper } from "./CellWrapper";

export type DatetimeCell = {
  value: string;
};

export function DatetimeCell<T = unknown, U = unknown>({ cell }: any) {
  const value = String(cell.getValue());
  console.log(new Date(value).toLocaleString());

  return (
    <CellWrapper value={value}>
      <p>{new Date(value).toLocaleString()}</p>
    </CellWrapper>
  );
}
