import type { ColumnType } from "@rafty/corp";
import { Checkbox } from "@rafty/ui";

export function rowSelectionColumn<T>(): ColumnType<T> {
  return {
    id: "_select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllRowsSelected()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
      />
    ),
    size: 36,
  };
}
