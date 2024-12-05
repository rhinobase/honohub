import dayjs from "dayjs";
import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

export function DatetimeCell() {
  const { value } = useField<ColumnThreadProps>();

  const date = new Date(String(value));

  return dayjs(date).format("D MMM YYYY hh:mm A");
}
