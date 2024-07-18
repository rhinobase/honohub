import { FireIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";

export function Logo({ className }: { className?: string }) {
  return (
    <FireIcon
      className={classNames(
        "w-7 h-7 stroke-secondary-500 dark:stroke-secondary-400",
        className,
      )}
    />
  );
}
