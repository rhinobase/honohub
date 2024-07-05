import { classNames } from "@rafty/ui";
import type { ComponentPropsWithoutRef, ElementType } from "react";

export type Prose<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  "as"
> & {
  as?: T;
};

export function Prose<T extends ElementType = "div">({
  as,
  className,
  ...props
}: Prose<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={classNames(className, "prose dark:prose-invert")}
      {...props}
    />
  );
}
