"use client";
import { Checkbox } from "@rafty/ui";

export function CheckboxCell({ row }: any) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={() => row.toggleSelected()}
    />
  );
}
