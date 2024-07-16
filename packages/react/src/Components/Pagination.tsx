import {
  PageJumper,
  PageSizeSelect,
  PaginationButtons,
  Pagination as RaftyPagination,
} from "@rafty/corp";
import { classNames } from "@rafty/ui";

export type Pagination = RaftyPagination;

export function Pagination({
  children,
  size = "sm",
  className,
  ...props
}: Pagination) {
  return (
    <RaftyPagination
      {...props}
      size={size}
      className={classNames(
        "border rounded-lg px-4 py-3 border-secondary-200 dark:border-secondary-800",
        className,
      )}
    >
      {children}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <span className="text-secondary-700 dark:text-secondary-300">
          Rows per page :
        </span>
        <PageSizeSelect className="dark:bg-secondary-950" />
      </div>
      <div className="flex items-center gap-1">
        <p className="text-secondary-700 dark:text-secondary-300">Page :</p>
        <PageJumper className="w-20" />
      </div>
      <PaginationButtons />
    </RaftyPagination>
  );
}
