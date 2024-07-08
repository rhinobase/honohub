"use client";
import { Checkbox } from "@rafty/ui";
import type { CellContext } from "@tanstack/react-table";

export function CheckboxCell<T = unknown, U = unknown>({
  row,
}: CellContext<T, U>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={() => row.toggleSelected()}
    />
  );
}
