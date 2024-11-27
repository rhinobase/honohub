import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

export function ColorCell() {
  const { value } = useField<ColumnThreadProps<string>>();

  return (
    <div className="flex items-center gap-2">
      <div style={{ background: value }} className="p-2 rounded-full" />
      <p>{value}</p>
    </div>
  );
}
