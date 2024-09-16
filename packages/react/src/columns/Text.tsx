import { Text } from "@rafty/ui";
import { useField } from "duck-form";

export function TextCell() {
  const { value } = useField<{ value: string }>();

  return (
    <Text className="truncate" title={value}>
      {value}
    </Text>
  );
}
