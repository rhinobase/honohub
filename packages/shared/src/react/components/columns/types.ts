import type { Row } from "@tanstack/react-table";
import type { TableColumnType } from ".";
import type { HeaderType } from "../../types";

export type ColumnThreadProps<T = unknown, U = unknown> = Omit<
  HeaderType,
  "type"
> & {
  value: T;
  type: TableColumnType;
  row: Row<U>;
};
