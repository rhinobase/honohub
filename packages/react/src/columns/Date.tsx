"use client";
import dateFormat from "dateformat";
import { CellWrapper } from "./CellWrapper";

export type DateCell = {
  format?: string;
  cell: any;
};

export function DateCell({ cell, format = "isoDate" }: DateCell) {
  const value = String(cell.getValue());
  const date = dateFormat(new Date(value), format);

  return <CellWrapper value={value}>{date}</CellWrapper>;
}
