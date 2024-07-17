import { TrashIcon } from "@heroicons/react/24/outline";
import { type ColumnType, DataTable as SharedDatatable } from "@rafty/corp";
import { Button, Text } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { SearchField } from "./SearchField";

export type DataTable<T> = {
  endpoint: string;
  columns: ColumnType<T>[];
};

export function DataTable<T = unknown>({ columns, endpoint }: DataTable<T>) {
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const offset = pageSize * pageIndex;

  const {
    data = { results: [], count: 0 },
    isFetching,
    isLoading,
  } = useQuery<{ results: T[]; count: number }>({
    queryKey: ["launches", pageIndex, pageSize],
    queryFn: () =>
      axios
        .get(`${endpoint}?limit=${pageSize}&offset=${offset}`)
        .then((res) => res.data),
  });

  const selected = Object.keys(rowsSelected).length;

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
        data={data.results}
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
        pages={Math.ceil(data.count / pageSize)}
        onChange={(page, pageSize) =>
          setPagination({
            pageIndex: page - 1,
            pageSize,
          })
        }
      >
        <p className="text-secondary-700 dark:text-secondary-300">
          {pageIndex * pageSize + 1}
          &nbsp;-&nbsp;
          {pageSize + pageIndex * pageSize > data.count
            ? data.count
            : pageSize + pageIndex * pageSize}
          &nbsp;of&nbsp;{data.count}
        </p>
      </Pagination>
    </>
  );
}
