"use client";
import { classNames } from "@rafty/ui";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";
import { SidebarLayout, usePreferences } from "../../providers";

export type SidebarItem = ComponentPropsWithoutRef<typeof Link> & {
  value: string;
  isActive?: boolean;
};

export const SidebarItem = forwardRef<ElementRef<typeof Link>, SidebarItem>(
  function SidebarItem(
    { className, href, value, isActive = false, ...props },
    forwardedRef,
  ) {
    const layout = usePreferences((state) => state.sidebar);

    return (
      <Link
        href={href}
        role="button"
        tabIndex={0}
        className={classNames(
          "rounded-md transition-all ease-in-out flex items-center p-2.5 gap-2",
          isActive
            ? "bg-primary-50 text-primary-600 dark:bg-primary-500/30 dark:text-white"
            : "text-secondary-600 hover:text-black hover:bg-secondary-200/80 dark:text-secondary-400 dark:hover:text-secondary-100 dark:hover:bg-secondary-800",
          layout === SidebarLayout.DEFAULT &&
            "min-w-[220px] w-full max-w-[220px]",
          className,
        )}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
