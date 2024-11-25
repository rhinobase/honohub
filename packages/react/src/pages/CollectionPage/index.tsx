import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { rowSelectionColumn } from "@honohub/shared";
import type { ColumnType } from "@rafty/corp";
import {
  Button,
  Toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  classNames,
  eventHandler,
  useBoolean,
} from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DuckField } from "duck-form";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { PageHeader, PageTitle } from "../../components/Header";
import { FiltersPanelToggleButton } from "../../components/filters";
import { useQueryParams } from "../../hooks";
import { useServer } from "../../providers";
import { getCollectionTableQueryKey } from "../../queries/collections/useCollectionTableData";
import type { CollectionType } from "../../types";
import { getPluralLabel } from "../../utils";
import { ActionMenu } from "./ActionMenu";
import { CollectionFilter } from "./CollectionFilter";
import { CollectionDataTable } from "./DataTable";

export type CollectionPage = Omit<CollectionType, "fields">;

export function CollectionPage(props: CollectionPage) {
  const { endpoint } = useServer();
  const queryClient = useQueryClient();
  const [isFilterOpen, setFilterOpen] = useBoolean();
  const [isFetching, setFetching] = useBoolean();

  const validatedParams = useQueryParams();

  const queryKey = getCollectionTableQueryKey({
    slug: props.slug,
    ...validatedParams,
  });

  const { mutate: deleteRecord } = useMutation({
    mutationFn: (id: string) =>
      endpoint.delete(`/collections/${props.slug}/${id}`),
    onMutate: (id) => {
      queryClient.setQueryData<{
        results: any[];
        count: number;
      }>(queryKey, (currentPageData) => {
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
        queryKey,
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
      cell: (props) => (
        <DuckField
          id={column.name}
          type={column.type}
          value={props.getValue()}
        />
      ),
    }));

    columns.unshift(rowSelectionColumn());

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="fab"
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
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
        <div className="flex-1" />
        <FiltersPanelToggleButton
          isActive={isFilterOpen}
          onInteract={setFilterOpen}
        />
      </PageHeader>
      <div className="flex h-full gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-x-auto overflow-y-hidden">
        <div className="w-full flex h-full flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          <CollectionDataTable
            columns={columns}
            slug={props.slug}
            actions={props.actions}
          />
        </div>
        {isFilterOpen && <CollectionFilter />}
      </div>
    </>
  );
}
