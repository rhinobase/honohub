import { classNames } from "@rafty/ui";
import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";

export type CollectionsWrapper = PropsWithChildren<{
  title: string;
  icon: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}>;

export function CollectionsWrapper(props: CollectionsWrapper) {
  return (
    <div
      className={classNames(
        "space-y-2 md:space-y-3 lg:space-y-4",
        props.className,
      )}
    >
      <div className="flex items-center gap-2 text-secondary-800 dark:text-secondary-200">
        {props.icon}
        <h3 className="text-xl font-semibold">{props.title}</h3>
      </div>
      {props.children}
    </div>
  );
}
