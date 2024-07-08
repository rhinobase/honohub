"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  type ColumnType,
  PageJumper,
  PageSizeSelect,
  Pagination,
  PaginationButtons,
  DataTable as SharedDatatable,
} from "@rafty/corp";
import { Button, Text } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CheckboxHeader } from "./CheckboxHeader";
import { SearchField } from "./SearchField";
import { getCell } from "./cells";

const COLUMNS: ColumnType<unknown>[] = [
  {
    id: "select",
    header: CheckboxHeader,
    cell: getCell("custom_checkbox"),
    size: 15,
    minSize: 10,
    maxSize: 40,
  },
  {
    header: "Id",
    accessorKey: "flight_number",
  },
  {
    header: "Mission Name",
    accessorKey: "mission_name",
  },
  {
    header: "Launch Year",
    accessorKey: "launch_year",
  },
  {
    header: "Tentative",
    accessorKey: "is_tentative",
  },
  {
    header: "Launch Window",
    accessorKey: "launch_window",
  },
  {
    header: "Rocket Name",
    cell: ({ row }) => row.original.rocket.rocket_name,
  },
];

export function CollectionDocumentsTable() {
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const offset = pageSize * pageIndex;

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);

      const response = await fetch(
        `https://api.spacexdata.com/v3/launches?limit=${pageSize}&offset=${offset}`,
      );
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [pageSize, offset]);

  const selected = Object.keys(rowsSelected).length;

  const dataLength = data?.length;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold capitalize">demo</h1>
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
        columns={COLUMNS}
        onRowsSelectedChange={setRowsSelected}
        enableRowSelection
        rowsSelected={rowsSelected}
        isFetching={isFetching}
      />
      <Pagination
        size="sm"
        className="border rounded-lg px-4 py-3 dark:border-secondary-800"
        currentPage={pageIndex + 1}
        pageLimit={pageSize}
        pages={Math.ceil(110 / pageSize)}
        onChange={(page, pageSize) =>
          setPagination({
            pageIndex: page - 1,
            pageSize,
          })
        }
      >
        <p className="text-secondary-700 dark:text-secondary-200">
          Total Items : {dataLength}
        </p>
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
      </Pagination>
    </div>
  );
}
