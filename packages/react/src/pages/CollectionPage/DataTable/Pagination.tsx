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
        "border rounded-lg px-4 py-3 border-secondary-300 dark:border-secondary-700",
        className,
      )}
    >
      {children}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <div className="text-secondary-700 dark:text-secondary-300 hidden md:block">
          Rows per page :
        </div>
        <PageSizeSelect className="dark:bg-secondary-950" />
      </div>
      <div className="md:flex items-center gap-1 hidden">
        <p className="text-secondary-700 dark:text-secondary-300">Page :</p>
        <PageJumper className="w-20" />
      </div>
      <PaginationButtons />
    </RaftyPagination>
  );
}
