"use client";
import { Checkbox } from "@rafty/ui";

export function CheckboxHeader({ table }: any) {
  return (
    <Checkbox
      checked={
        table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()
          ? "indeterminate"
          : false
      }
      onCheckedChange={() => table.toggleAllRowsSelected()}
    />
  );
}
