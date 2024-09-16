import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import { useField } from "duck-form";

export function BooleanCell() {
  const { value } = useField<{ value: boolean }>();
  const Icon = value ? CheckIcon : XMarkIcon;

  return (
    <Icon
      height={16}
      width={16}
      className={classNames(
        value
          ? "text-green-500 dark:text-green-300"
          : "text-red-500 dark:text-red-300",
        "mx-auto stroke-[3]",
      )}
    />
  );
}
