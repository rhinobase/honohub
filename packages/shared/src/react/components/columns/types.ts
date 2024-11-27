import type { HeaderType } from "@/types";
import type { Row } from "@tanstack/react-table";
import type { TableColumnType } from ".";

export type ColumnThreadProps<T = unknown, U = unknown> = Omit<
  HeaderType,
  "type"
> & {
  value: T;
  type: TableColumnType;
  row: Row<U>;
};
