import { Text } from "@rafty/ui";
import { useField } from "duck-form";
import type { CommonHeaderType } from "../../types";

type SimpleHeaderProps = CommonHeaderType & {
  value: string;
};

export function SimpleCell() {
  // Getting the value
  const { value, options } = useField<SimpleHeaderProps>();

  // Going through all the options
  if (options) {
    const item = options.list?.find((item) => item.value === value);

    return (
      <Text className="truncate" title={item?.title ?? "Not Available"}>
        {item?.title ?? "N/A"}
      </Text>
    );
  }

  return (
    <Text className="truncate" title={value}>
      {value}
    </Text>
  );
}
