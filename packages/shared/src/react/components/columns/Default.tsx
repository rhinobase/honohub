import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

export function DefaultCell() {
  const { value } = useField<ColumnThreadProps>();

  return String(value);
}
