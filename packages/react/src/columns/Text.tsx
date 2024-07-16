import { CellWrapper } from "./CellWrapper";

export function Text({ cell }: any) {
  const value = String(cell.getValue());

  return <CellWrapper value={value}>{value}</CellWrapper>;
}
