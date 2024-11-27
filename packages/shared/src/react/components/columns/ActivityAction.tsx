import type { HistoryAction } from "@/types";
import { getActionPerformed } from "@/utils/getActionPerformed";
import { Tag } from "@rafty/ui";
import { useField } from "duck-form";
import type { ColumnThreadProps } from "./types";

export function ActivityAction() {
  const { value } = useField<ColumnThreadProps<HistoryAction>>();

  const { label, color } = getActionPerformed(value);

  // @ts-expect-error
  return <Tag colorScheme={color}>{label}</Tag>;
}
