import dateFormat from "dateformat";
import { CellWrapper } from "./CellWrapper";

export type Datetime = {
  format?: string;
  cell: any;
};

export function Datetime({ cell, format = "default" }: Datetime) {
  const value = String(cell.getValue());
  const date = new Date(value);
  const datetime = dateFormat(date, format);

  return <CellWrapper value={datetime}>{datetime}</CellWrapper>;
}
