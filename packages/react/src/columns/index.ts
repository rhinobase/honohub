import type { ReactNode } from "react";
import { BooleanCell } from "./Boolean";
import { DateCell } from "./Date";
import { Datetime } from "./Datetime";
import { EditButton } from "./EditButton";
import { Text } from "./Text";

const CELLS: Record<string, (props: any) => ReactNode> = {
  date: DateCell,
  boolean: BooleanCell,
  datetime: Datetime,
  string: Text,
  number: Text,
  action: EditButton,
};

export function getCell(type: string) {
  if (type in CELLS) return CELLS[type];

  return undefined;
}
