import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type ErrorComponent = HTMLAttributes<HTMLDivElement>;

export function ErrorComponent({
  children = "Something went wrong",
  className,
  ...props
}: ErrorComponent) {
  const childrenComponent =
    typeof children === "string" ? (
      <p className="text-sm md:text-base">{children}</p>
    ) : (
      children
    );

  return (
    <div
      {...props}
      className={classNames(
        "flex h-full w-full items-center justify-center gap-1.5 text-red-500 dark:text-red-300 select-none",
        className,
      )}
    >
      <ExclamationCircleIcon className="size-4 md:size-6 stroke-2" />
      {childrenComponent}
    </div>
  );
}
