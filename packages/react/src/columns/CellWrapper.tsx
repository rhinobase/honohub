import { useField } from "duck-form";
import type { PropsWithChildren } from "react";

export function FibrCellWrapper(props: PropsWithChildren) {
  const { value } = useField();

  if (value == null) return "N/A";

  return props.children;
}
