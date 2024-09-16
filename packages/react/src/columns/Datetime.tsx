import dayjs from "dayjs";
import { useField } from "duck-form";

export function DatetimeCell() {
  const { value } = useField<{ value: string }>();

  const date = new Date(String(value));

  return dayjs(date).format("D MMM YYYY hh:mm A");
}
