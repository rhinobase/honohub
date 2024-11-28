"use client";
import { Accordion } from "@rafty/ui";
import type { PropsWithChildren, ReactNode } from "react";

export type FiltersPanel = PropsWithChildren<{ clearAllButton?: ReactNode }>;

export function FiltersPanel(props: FiltersPanel) {
  return (
    <div className="border border-secondary-300 dark:border-secondary-700 rounded-md max-h-full h-max flex flex-col min-w-72 overflow-hidden">
      <div className="flex min-h-[42px] items-center bg-secondary-100 dark:bg-secondary-800 pl-2.5 pr-1.5 py-1.5 rounded-t-[inherit] border-b border-secondary-300 dark:border-secondary-700">
        <p className="text-secondary-600 dark:text-secondary-300 text-sm font-semibold">
          Filters
        </p>
        {props.clearAllButton && (
          <>
            <div className="flex-1" />
            {props.clearAllButton}
          </>
        )}
      </div>
      <Accordion
        type="multiple"
        size="sm"
        className="flex flex-col space-y-0 max-h-full overflow-y-auto"
      >
        {props.children}
      </Accordion>
    </div>
  );
}
