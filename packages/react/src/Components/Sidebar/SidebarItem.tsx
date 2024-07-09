"use client";
import { classNames } from "@rafty/ui";
import Link from "next/link";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react";

export type SidebarItem = ComponentPropsWithoutRef<typeof Link> & {
  value: string;
};

export const SidebarItem = forwardRef<ElementRef<typeof Link>, SidebarItem>(
  ({ className, href, value, ...props }, forwardedRef) => {
    return (
      <Link
        href={href}
        title={value}
        className={classNames(
          "gap-2 rounded-md w-full border-2 transition-all ease-in-out flex items-center px-2 border-transparent text-secondary-600 hover:text-black hover:bg-secondary-200/80",
          className,
        )}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
SidebarItem.displayName = "SidebarItem";
