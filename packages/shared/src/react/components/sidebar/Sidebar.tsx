import { classNames } from "@rafty/ui";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export type Sidebar = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  footer?: ReactNode;
};

export const Sidebar = forwardRef<HTMLDivElement, Sidebar>(function Sidebar(
  { children, className, header, footer, ...props },
  forwardedRef,
) {
  return (
    <div
      {...props}
      className={classNames(
        "h-full border-r border-secondary-200 dark:border-secondary-800",
        className,
      )}
      ref={forwardedRef}
    >
      <aside className="py-2 pl-2 flex flex-col items-start gap-4 h-full">
        {header && <div className="pr-2 w-full">{header}</div>}
        <nav className="flex-grow flex flex-col items-center justify-start w-full gap-1 overflow-x-hidden overflow-y-auto pr-2">
          {children}
        </nav>
        {footer && <div className="pr-2 w-full">{footer}</div>}
      </aside>
    </div>
  );
});
