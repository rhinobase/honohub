import { PlusIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "@rafty/corp";
import { Button, Checkbox } from "@rafty/ui";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getCell } from "../columns";
import { DataTable, PageHeader, PageTitle } from "../components";
import type { CollectionType } from "../types";
import { getPluralLabel } from "../utils";

export type CollectionPage = Omit<CollectionType, "fields">;

export function CollectionPage(props: CollectionPage) {
  const columns = useMemo(() => {
    const columns: ColumnType<unknown>[] = props.columns.map((column) => ({
      id: column.name,
      header: column.label,
      accessorKey: column.name,
      cell: getCell(column.type),
    }));

    columns.unshift({
      id: "_select",
      header: ({ table }: any) => (
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
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
        />
      ),
      size: 30,
    });

    columns.push({
      id: "action",
      accessorKey: "id",
      header: "Action",
      cell: getCell("action"),
    });

    return columns;
  }, [props.columns]);

  return (
    <>
      <PageHeader className="justify-between">
        <PageTitle className="capitalize">
          {getPluralLabel(props.label)}
        </PageTitle>
        <Link to={`/collections/${props.slug}/create`}>
          <Button
            colorScheme="primary"
            leftIcon={<PlusIcon className="size-3.5 stroke-[3]" />}
          >
            Create
          </Button>
        </Link>
      </PageHeader>
      <DataTable columns={columns} slug={props.slug} actions={props.actions} />
    </>
  );
}
