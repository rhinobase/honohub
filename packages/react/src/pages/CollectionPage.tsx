import { PlusIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "@rafty/corp";
import { Button, Checkbox, Toast } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { getCell } from "../columns";
import {
  CollectionTableActionMenu,
  DataTable,
  PageHeader,
  PageTitle,
} from "../components";
import { useServer } from "../providers";
import type { CollectionType } from "../types";
import { getPluralLabel } from "../utils";
import { queryValidation } from "../validations";

export type CollectionPage = Omit<CollectionType, "fields">;

export function CollectionPage(props: CollectionPage) {
  const { endpoint } = useServer();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const validatedParams = queryValidation.parse(
    Object.fromEntries(searchParams.entries()),
  );

  const { mutate: deleteRecord } = useMutation({
    mutationFn: (id: string) =>
      endpoint.delete(`/collections/${props.slug}/${id}`),
    onMutate: (id) => {
      queryClient.setQueryData<{
        results: any[];
        count: number;
      }>(["collections", props.slug, validatedParams], (currentPageData) => {
        const nextPageData = queryClient.getQueryData<{
          results: any[];
          count: number;
        }>([
          "collections",
          props.slug,
          {
            offset: validatedParams.offset + 1,
            limit: validatedParams.limit,
          },
        ]);

        if (!currentPageData) return;

        const data = {
          count: currentPageData.count,
          results: [
            ...currentPageData.results.filter((val) => {
              if (typeof val.id === "number") return val.id !== Number(id);
              return val.id !== id;
            }),
          ],
        };

        if (nextPageData) data.results.push(nextPageData.results[0]);

        return data;
      });
    },
    onSettled: () =>
      queryClient.refetchQueries({
        queryKey: ["collections", props.slug, validatedParams],
      }),
    onError: (err, id) => {
      console.error(err);
      toast.custom((t) => (
        <Toast
          severity="error"
          title={`Unable to delete record - ${id}`}
          visible={t.visible}
        />
      ));
    },
  });

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
      cell: (data) => {
        const id = String(data?.getValue());
        return (
          <CollectionTableActionMenu
            id={id}
            onDelete={() => deleteRecord(id)}
          />
        );
      },
    });

    return columns;
  }, [props.columns, deleteRecord]);

  return (
    <>
      <PageHeader>
        <PageTitle className="capitalize">
          {getPluralLabel(props.label)}
        </PageTitle>
        <div className="flex-1" />
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
