"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  type ColumnType,
  PageJumper,
  PageSizeSelect,
  PaginationButtons,
  Pagination as RaftyPagination,
  DataTable as SharedDatatable,
} from "@rafty/corp";
import { Button, Text, classNames } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { SearchField } from "./SearchField";

export type CollectionTable<T> = {
  endpoint: string;
  columns: ColumnType<T>[];
};

export function CollectionTable<T = unknown>({
  columns,
  endpoint,
}: CollectionTable<T>) {
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const offset = pageSize * pageIndex;

  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery<T[]>({
    queryKey: ["launches", pageIndex, pageSize],
    queryFn: () =>
      axios
        .get(`${endpoint}?limit=${pageSize}&offset=${offset}`)
        .then((res) => res.data),
  });

  const selected = Object.keys(rowsSelected).length;
  const count = 110;

  return (
    <>
      {selected > 0 ? (
        <div className="w-full min-h-[38px] flex items-center">
          <Text className="text-sm">
            {selected} {selected > 1 ? "rows" : "row"} selected
          </Text>
          <div className="flex-1" />
          <Button
            colorScheme="error"
            leftIcon={<TrashIcon className="size-4 stroke-2" />}
          >
            Delete
          </Button>
        </div>
      ) : (
        <SearchField />
      )}
      <SharedDatatable
        data={data}
        columns={columns}
        isFetching={isFetching}
        isLoading={isLoading}
        enableRowSelection
        rowsSelected={rowsSelected}
        onRowsSelectedChange={setRowsSelected}
      />
      <Pagination
        currentPage={pageIndex + 1}
        pageLimit={pageSize}
        pages={Math.ceil(count / pageSize)}
        onChange={(page, pageSize) =>
          setPagination({
            pageIndex: page - 1,
            pageSize,
          })
        }
      >
        <p className="text-secondary-700 dark:text-secondary-200">
          {pageIndex * pageSize + 1}
          &nbsp;-&nbsp;
          {pageSize + pageIndex * pageSize > count
            ? count
            : pageSize + pageIndex * pageSize}
          &nbsp;of&nbsp;{count}
        </p>
      </Pagination>
    </>
  );
}

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
        "border rounded-lg px-4 py-3 dark:border-secondary-800",
        className,
      )}
    >
      {children}
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <span className="text-secondary-700 dark:text-secondary-200">
          Rows per page :
        </span>
        <PageSizeSelect className="dark:bg-secondary-950" />
      </div>
      <div className="flex items-center gap-1">
        <p className="text-secondary-700 dark:text-secondary-200">Page :</p>
        <PageJumper className="w-20" />
      </div>
      <PaginationButtons />
    </RaftyPagination>
  );
}
