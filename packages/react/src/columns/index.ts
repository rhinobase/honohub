import { BooleanCell } from "./Boolean";
import { DateCell } from "./Date";
import { DatetimeCell } from "./Datetime";
import { TextCell } from "./Text";

export { FibrCellWrapper } from "./CellWrapper";

export const COLUMN_HEADER_COMPONENTS = {
  date: DateCell,
  boolean: BooleanCell,
  datetime: DatetimeCell,
  string: TextCell,
  number: TextCell,
};

export type ColumnType = keyof typeof COLUMN_HEADER_COMPONENTS;
