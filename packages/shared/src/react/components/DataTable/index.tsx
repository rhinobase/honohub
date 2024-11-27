"use client";
import { Pagination, rowSelectionColumn } from "@honohub/shared";
import { type ColumnType, DataTable as RaftyDataTable } from "@rafty/corp";
import { Skeleton, Text } from "@rafty/ui";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { Searchbar } from "../Searchbar";
import { COLUMN_HEADER_COMPONENTS, type TableColumnType } from "../columns";
import { CellWrapper } from "../columns/CellWrapper";
import { ActionSelect } from "./ActionSelect";

export type DataTable = {
  headers: {
    id?: string;
    accessorKey: string;
    header: string | (() => JSX.Element);
    type: TableColumnType;
    metadata?: Record<string, unknown>;
  }[];
  data:
    | {
        results: Record<string, unknown>[];
        count: number;
      }
    | undefined;
  isLoading: boolean;
  enableSearch?: boolean;
  enablePagination?: boolean;
} & (
  | { enableSelection?: true; actionApiUrl: string; dataQueryKey: unknown[] }
  | {
      enableSelection?: false;
      actionApiUrl?: undefined;
      dataQueryKey?: undefined;
    }
);

export function DataTable({
  headers,
  data,
  isLoading,
  enableSelection = true,
  enableSearch = true,
  enablePagination = true,
  actionApiUrl,
  dataQueryKey,
}: DataTable) {
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});
  const [queryParams, setQueryParams] = useQueryStates({
    limit: parseAsInteger.withDefault(10),
    offset: parseAsInteger.withDefault(0),
  });

  const { limit, offset } = queryParams;

  const pageIndex = offset / limit;

  const columns = useMemo(() => {
    const columns: ColumnType<unknown>[] = headers.map((column) => ({
      id: column.id ?? column.accessorKey,
      header: column.header,
      accessorKey: column.accessorKey,
      cell: (props) => (
        <DuckField
          id={column.id ?? column.accessorKey}
          type={column.type}
          value={props.getValue()}
          row={props.row}
          {...column.metadata}
        />
      ),
    }));

    if (enableSelection) columns.unshift(rowSelectionColumn());

    return columns;
  }, [headers, enableSelection]);

  const count = data?.count ?? 0;

  const selectedRowsLength = Object.keys(rowsSelected).length;
  const selectedRows = data
    ? Object.keys(rowsSelected).map((index) => data.results[Number(index)])
    : undefined;

  return (
    <>
      {selectedRowsLength > 0 && enableSelection === true ? (
        <div className="w-full min-h-[38px] flex items-center">
          <Text className="text-sm">
            {selectedRowsLength} {selectedRowsLength > 1 ? "rows" : "row"}{" "}
            selected
          </Text>
          <div className="flex-1" />
          <ActionSelect
            selectedRows={selectedRows}
            onActionComplete={() => setRowsSelected({})}
            actionApiUrl={actionApiUrl ?? ""}
            dataQueryKey={dataQueryKey ?? []}
          />
        </div>
      ) : (
        enableSearch && <Searchbar />
      )}
      <DuckForm components={COLUMN_HEADER_COMPONENTS}>
        <Blueprint wrapper={CellWrapper}>
          <RaftyDataTable
            columns={columns}
            data={data?.results ?? []}
            isLoading={isLoading}
            onRowsSelectedChange={setRowsSelected}
            rowsSelected={rowsSelected}
            enableRowSelection={enableSelection}
            className="h-max grid overflow-hidden"
          />
        </Blueprint>
      </DuckForm>
      {enablePagination &&
        (isLoading ? (
          <Skeleton className="h-14 w-full rounded-lg" />
        ) : (
          <Pagination
            pageIndex={pageIndex}
            count={count}
            currentPage={pageIndex + 1}
            pageLimit={limit}
            pages={Math.ceil(count / limit)}
            onChange={(page, limit) => {
              setQueryParams({
                limit: limit,
                offset: page > 0 ? (page - 1) * limit : 0,
              });
            }}
          />
        ))}
    </>
  );
}
