import { ArrowPathIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import type { ColumnType } from "@rafty/corp";
import {
  Button,
  Checkbox,
  Toast,
  classNames,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getCell } from "../../columns";
import { APIReferenceDrawer } from "../../components/APIReference";
import { PageHeader, PageTitle } from "../../components/Header";
import { useServer } from "../../providers";
import type { CollectionType } from "../../types";
import { getPluralLabel } from "../../utils";
import { queryValidation } from "../../validations";
import { ActionMenu } from "./ActionMenu";
import { CollectionDataTable } from "./DataTable";

export type CollectionPage = Omit<CollectionType, "fields">;

export function CollectionPage(props: CollectionPage) {
  const { endpoint } = useServer();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [isApiRefDrawerOpen, setApiRefDrawerOpen] = useBoolean();
  const [isFetching, setFetching] = useBoolean();

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
        return <ActionMenu id={id} onDelete={() => deleteRecord(id)} />;
      },
    });

    return columns;
  }, [props.columns, deleteRecord]);

  const handleApiRefDrawerOpen = eventHandler(() => {
    setApiRefDrawerOpen(true);
  });
  const handleRefresh = eventHandler(async () => {
    setFetching(true);
    await queryClient.refetchQueries({
      queryKey: ["collections", props.slug, validatedParams],
    });
    setFetching(false);
  });

  return (
    <>
      <PageHeader>
        <PageTitle className="capitalize">
          {getPluralLabel(props.label)}
        </PageTitle>
        <div className="flex-1" />
        <Button
          leftIcon={<CodeBracketIcon className="size-4 stroke-2" />}
          variant="outline"
          onClick={handleApiRefDrawerOpen}
          onKeyDown={handleApiRefDrawerOpen}
        >
          API
        </Button>
        <Button
          size="icon"
          variant="ghost"
          isDisabled={isFetching}
          onClick={handleRefresh}
          onKeyDown={handleRefresh}
          className="p-2"
        >
          <ArrowPathIcon
            className={classNames(
              isFetching && "animate-spin",
              "size-5 stroke-2",
            )}
          />
        </Button>
      </PageHeader>
      <CollectionDataTable
        columns={columns}
        slug={props.slug}
        actions={props.actions}
      />
      <APIReferenceDrawer
        open={isApiRefDrawerOpen}
        onOpenChange={setApiRefDrawerOpen}
        slug={props.slug}
      />
    </>
  );
}
