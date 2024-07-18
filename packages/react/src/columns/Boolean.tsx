import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import { CellWrapper } from "./CellWrapper";

export function BooleanCell({ cell }: any) {
  const value = Boolean(cell.getValue());
  const Icon = value ? CheckIcon : XMarkIcon;

  return (
    <CellWrapper value={value}>
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
    </CellWrapper>
  );
}
