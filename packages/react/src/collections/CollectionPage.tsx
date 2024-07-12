import type { ColumnType } from "@rafty/corp";
import { Button, Checkbox } from "@rafty/ui";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getCell } from "../Columns";
import { DataTable, PageHeader, PageTitle } from "../Components";
import type { FieldProps } from "../Fields";
import type { CollectionType } from "./types";

export type CollectionPage = Omit<CollectionType, "fields"> & {
  serverUrl: string;
};

export function CollectionPage(props: CollectionPage) {
  const columns = useMemo<ColumnType<unknown>[]>(
    () =>
      props.columns.map((column) => ({
        header: column.label,
        accessorKey: column.name,
        cell: getCell(column.type as FieldProps["type"]),
      })),
    [props.columns],
  );

  columns.unshift({
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={() => table.toggleAllRowsSelected()}
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
      />
    ),
    size: 30,
  });

  return (
    <>
      <PageHeader className="justify-between">
        <PageTitle className="capitalize">{props.slug}</PageTitle>
        <Link to={`/${props.slug}/create`}>
          <Button colorScheme="primary">Create</Button>
        </Link>
      </PageHeader>
      <DataTable
        columns={columns}
        endpoint={`${props.serverUrl}/${props.slug}`}
      />
    </>
  );
}
