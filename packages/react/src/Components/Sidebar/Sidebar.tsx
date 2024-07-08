"use client";
import { classNames } from "@rafty/ui";
import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export type Sidebar = HTMLAttributes<HTMLDivElement> & {
  header?: ReactNode;
  footer?: ReactNode;
};

export const Sidebar = forwardRef<HTMLDivElement, Sidebar>(
  ({ children, className, header, footer, ...props }, forwardedRef) => (
    <div
      {...props}
      className={classNames("flex h-full w-60 border-r", className)}
      ref={forwardedRef}
    >
      <aside className="py-5 px-3 flex w-full flex-col gap-8 h-full flex-grow-0 flex-shrink-0">
        {header}
        <nav className="flex-grow flex flex-col items-center justify-start w-full gap-4 overflow-x-hidden overflow-y-auto">
          {children}
        </nav>
        {footer}
      </aside>
    </div>
  ),
);
Sidebar.displayName = "Sidebar";
