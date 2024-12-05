import { Text } from "@rafty/ui";
import { useField } from "duck-form";
import type { ArrayHeaderType } from "../../types";

type ArrayHeaderProps = ArrayHeaderType & {
  value: unknown;
};

export function ArrayCell() {
  const { value, order } = useField<ArrayHeaderProps>();

  // Going through all the options
  let title: string | undefined;
  if (Array.isArray(value)) {
    if (order === -1) title = value[value.length - 1];
    else if (order === 1) title = value[0];
    else title = value.join(", ");
  }

  return (
    <Text className="truncate" title={title}>
      {title}
    </Text>
  );
}
