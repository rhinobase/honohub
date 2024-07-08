import type { ReactNode } from "react";
import { BooleanCell } from "./BooleanCell";
import { CheckboxCell } from "./CheckboxCell";
import { ClipboardCell } from "./ClipboardCell";
import { DateCell } from "./DateCell";
import { DatetimeCell } from "./DatetimeCell";
import { EditButton } from "./EditButton";

const CELLS: {
  [K in any]?: (props: any) => ReactNode;
} = {
  custom_action: EditButton,
  date: DateCell,
  custom_boolean: BooleanCell,
  custom_datetime: DatetimeCell,
  custom_clipboard: ClipboardCell,
  custom_checkbox: CheckboxCell,
};

export function getCell(type: any) {
  if (type in CELLS) return CELLS[type];

  return undefined;
}
