import { classNames } from "@rafty/ui";
import type { HTMLAttributes } from "react";

export type PageWrapper = HTMLAttributes<HTMLDivElement>;

export function PageWrapper({ children, className, ...props }: PageWrapper) {
  return (
    <div
      {...props}
      className={classNames(
        "flex-1 px-3 py-2 md:px-[18px] md:py-3 lg:px-6 lg:py-4 overflow-x-hidden overflow-y-auto scroll-smooth",
        className,
      )}
    >
      <div className="flex flex-col min-h-0 w-full flex-grow gap-3 md:gap-4 lg:gap-5">
        {children}
      </div>
    </div>
  );
}
