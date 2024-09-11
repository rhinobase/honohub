import { Spinner, classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type LoadingComponent = HTMLAttributes<HTMLDivElement>;

export function LoadingComponent({
  className,
  children = "Loading...",
  ...props
}: LoadingComponent) {
  const textComponent =
    typeof children === "string" ? (
      <p className="text-secondary-600 dark:text-secondary-400 text-sm">
        {children}
      </p>
    ) : (
      children
    );

  return (
    <div
      {...props}
      className={classNames(
        "flex h-full w-full items-center justify-center gap-1.5",
        className,
      )}
    >
      <Spinner />
      {textComponent}
    </div>
  );
}
