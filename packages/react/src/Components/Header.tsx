import { classNames } from "@rafty/ui";
import { type HTMLAttributes, forwardRef } from "react";

export type PageHeader = HTMLAttributes<HTMLElement>;

export const PageHeader = forwardRef<HTMLElement, PageHeader>(
  function PageHeader({ className, ...props }, forwardedRef) {
    return (
      <header
        {...props}
        className={classNames("flex items-center gap-4", className)}
        ref={forwardedRef}
      />
    );
  },
);

export type PageTitle = HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const PageTitle = forwardRef<HTMLHeadingElement, PageTitle>(
  function PageTitle({ as = "h2", className, ...props }, forwardedRef) {
    const Component = as;

    return (
      <Component
        {...props}
        className={classNames(
          "text-3xl font-bold dark:text-secondary-100",
          className,
        )}
        ref={forwardedRef}
      />
    );
  },
);
