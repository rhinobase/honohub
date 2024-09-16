"use client";
import type { FieldProps } from "@duck-form/fields";
import { type ColumnType, DataTable as RaftyDataTable } from "@rafty/corp";
import { Checkbox, Text, useQueryParams } from "@rafty/ui";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import {
  type PropsWithChildren,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import z from "zod";
import { Pagination } from "../Pagination";
import { Searchbar } from "../Searchbar";
import { ActionSelect } from "./ActionSelect";

export type DataTable = Pick<ActionSelect, "actions"> &
  Searchbar &
  Omit<
    RaftyDataTable<unknown>,
    "columns" | "data" | "onRowsSelectedChange" | "rowsSelected" | "size"
  > & {
    headers: {
      id?: string;
      accessorKey: string;
      header: string;
      type: any;
      metadata?: Record<string, unknown>;
    }[];
    data?: {
      results: Record<string, unknown>[];
      count: number;
    };
    columnHeaderComponent: Record<string, () => JSX.Element>;
    enableSearch?: boolean;
    enablePagination?: boolean;
    isActionLoading?: boolean;
    isActionError?: boolean;
    fibrCellWrapper: (props: PropsWithChildren) => ReactNode;
    findColumnHeaderType: (props: { name: string; type: string }) => any;
    onActionComplete: (name: string, row: any) => void | Promise<void>;
    schema?: Record<string, FieldProps>;
  };

export function DataTable({
  headers,
  data,
  enableRowSelection = true,
  enableSearch = true,
  enablePagination = true,
  onChange,
  pathname,
  searchParams,
  fibrCellWrapper,
  columnHeaderComponent,
  findColumnHeaderType,
  actions,
  isActionError,
  isActionLoading,
  paramName,
  onActionComplete,
  schema,
  ...props
}: DataTable) {
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});

  const { limit, offset } = z
    .object({
      limit: z.coerce.number().min(0).max(100).default(10),
      offset: z.coerce.number().nonnegative().default(0),
    })
    .parse(Object.fromEntries(searchParams.entries()));

  const pageIndex = offset / limit;

  const columns = useMemo<ColumnType<unknown>[]>(() => {
    const columns: ColumnType<unknown>[] = headers.map((column) => ({
      id: column.id ?? column.accessorKey,
      header: column.header,
      accessorKey: column.accessorKey,
      cell: (props) => (
        <DuckField
          id={column.id ?? column.accessorKey}
          type={findColumnHeaderType({
            name: column.accessorKey,
            type: column.type,
          })}
          value={props.getValue()}
          {...column.metadata}
        />
      ),
    }));

    if (enableRowSelection)
      columns.unshift({
        id: "_select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={() => table.toggleAllRowsSelected()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={() => row.toggleSelected()}
          />
        ),
        size: 30,
      });

    return columns;
  }, [headers, enableRowSelection, findColumnHeaderType]);

  const count = data?.count ?? 0;

  const { setQueryParams } = useQueryParams({
    pathname,
    searchParams: searchParams.toString(),
    onChange,
  });

  const selectedRows = Object.keys(rowsSelected).map(
    (index) => data?.results[Number(index)],
  );

  const selectedRowsLength = selectedRows.length;

  return (
    <>
      {selectedRowsLength > 0 && enableRowSelection === true ? (
        <div className="w-full min-h-[38px] flex items-center">
          <Text className="text-sm">
            {selectedRowsLength} {selectedRowsLength > 1 ? "rows" : "row"}{" "}
            selected
          </Text>
          <div className="flex-1" />
          <ActionSelect
            handler={(name) => {
              onActionComplete(name, rowsSelected);
              setRowsSelected({});
            }}
            actions={actions}
            isError={isActionError}
            isLoading={isActionLoading}
          />
        </div>
      ) : (
        enableSearch && (
          <Searchbar
            onChange={onChange}
            pathname={pathname}
            searchParams={searchParams}
            paramName={paramName}
          />
        )
      )}
      {/* this div is to manage the styling of empty data state */}
      <div className="flex flex-col overflow-hidden">
        <DuckForm components={columnHeaderComponent}>
          <Blueprint schema={schema} wrapper={fibrCellWrapper}>
            <RaftyDataTable
              {...props}
              columns={columns}
              data={data?.results ?? []}
              onRowsSelectedChange={setRowsSelected}
              rowsSelected={rowsSelected}
              enableRowSelection={enableRowSelection}
            />
          </Blueprint>
        </DuckForm>
      </div>
      {enablePagination && (
        <Pagination
          pageIndex={pageIndex}
          count={count}
          currentPage={pageIndex + 1}
          pageLimit={limit}
          pages={Math.ceil(count / limit)}
          onChange={(page, limit) => {
            setQueryParams({
              limit: String(limit),
              offset: page > 0 ? String((page - 1) * limit) : 0,
            });
          }}
        />
      )}
    </>
  );
}
