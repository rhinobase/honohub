import {
  PageJumper,
  PageSizeSelect,
  PaginationButtons,
  Pagination as RaftyPagination,
} from "@rafty/corp";
import { classNames } from "@rafty/ui";

export type Pagination = RaftyPagination & {
  pageIndex: number;
  count: number;
};

export function Pagination({
  children,
  size = "sm",
  className,
  count,
  pageLimit,
  pageIndex,
  ...props
}: Pagination) {
  return (
    <RaftyPagination
      {...props}
      pageLimit={pageLimit}
      size={size}
      className={classNames(
        "border rounded-lg px-4 py-3 border-secondary-300 dark:border-secondary-700",
        className,
      )}
    >
      <p className="text-secondary-700 dark:text-secondary-300">
        {count !== 0 ? pageIndex * pageLimit + 1 : 0}
        &nbsp;-&nbsp;
        {pageLimit + pageIndex * pageLimit > count
          ? count
          : pageLimit + pageIndex * pageLimit}
        &nbsp;of&nbsp;{count}
      </p>
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
