import type { ReactNode } from "react";
import type { FieldProps } from "../Fields";
import { BooleanCell } from "./Boolean";
import { DateCell } from "./Date";
import { Datetime } from "./Datetime";
import { EditButton } from "./EditButton";
import { Text } from "./Text";

const CELLS: {
  [K in FieldProps["type"]]?: (props: any) => ReactNode;
} = {
  date: DateCell,
  custom_boolean: BooleanCell,
  custom_datetime: Datetime,
  custom_text: Text,
  custom_action: EditButton,
};

export function getCell(type: FieldProps["type"]) {
  if (type in CELLS) return CELLS[type];

  return undefined;
}
