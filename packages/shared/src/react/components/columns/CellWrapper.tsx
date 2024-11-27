import { useField } from "duck-form";
import type { PropsWithChildren } from "react";

export function CellWrapper(props: PropsWithChildren) {
  const { value, type } = useField();

  if (value == null && type !== "boolean") return "N/A";

  return props.children;
}
