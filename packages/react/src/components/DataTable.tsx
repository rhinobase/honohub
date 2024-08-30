import * as HeroIcons from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  type ColumnType,
  Combobox,
  ComboboxContent,
  ComboboxItem,
  type ComboboxOptionType,
  ComboboxTrigger,
  DataTable as SharedDatatable,
  useComboboxContext,
} from "@rafty/corp";
import { Button, Text, Toast } from "@rafty/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { useDialogManager, useServer } from "../providers";
import type { CollectionType } from "../types";
import { queryValidation } from "../validations";
import { Pagination } from "./Pagination";
import { SearchField } from "./SearchField";

export type DataTable<T> = {
  columns: ColumnType<T>[];
} & Pick<CollectionType, "slug" | "actions">;

export function DataTable<T = unknown>({
  columns,
  slug,
  actions,
}: DataTable<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { endpoint } = useServer();
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});

  const validatedParams = queryValidation.parse(
    Object.fromEntries(searchParams.entries()),
  );
  const pageIndex = validatedParams.offset / validatedParams.limit;

  const {
    data = { results: [], count: 0 },
    isFetching,
    isLoading,
  } = useQuery<{ results: T[]; count: number }>({
    queryKey: ["collections", slug, validatedParams],
    queryFn: () =>
      endpoint
        .get(`/collections/${slug}`, {
          params: validatedParams,
        })
        .then((res) => res.data),
  });

  const selectedRowsLength = Object.keys(rowsSelected).length;
  const selectedRows = Object.keys(rowsSelected).map(
    (index) => data.results[Number(index)],
  );

  return (
    <>
      {selectedRowsLength > 0 ? (
        <div className="w-full min-h-[38px] flex items-center">
          <Text className="text-sm">
            {selectedRowsLength} {selectedRowsLength > 1 ? "rows" : "row"}{" "}
            selected
          </Text>
          <div className="flex-1" />
          <ActionSelect
            actions={actions}
            slug={slug}
            selectedRows={selectedRows}
            onActionComplete={() => setRowsSelected({})}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <SearchField />
          <Link to={`/collections/${slug}/create`}>
            <Button
              colorScheme="primary"
              leftIcon={<PlusIcon className="size-4 stroke-[3]" />}
              className="hidden lg:flex"
            >
              Create
            </Button>
            <Button colorScheme="primary" className="lg:hidden p-2">
              <PlusIcon className="size-5 stroke-2" />
            </Button>
          </Link>
        </div>
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
        pageLimit={validatedParams.limit}
        pages={Math.ceil(data.count / validatedParams.limit)}
        onChange={(page, limit) => {
          setSearchParams({
            limit: String(limit),
            offset: String((page - 1) * limit),
          });
        }}
        className="mb-14 md:mb-0"
      >
        <p className="text-secondary-700 dark:text-secondary-300">
          {pageIndex * validatedParams.limit + 1}
          &nbsp;-&nbsp;
          {validatedParams.limit + pageIndex * validatedParams.limit >
          data.count
            ? data.count
            : validatedParams.limit + pageIndex * validatedParams.limit}
          &nbsp;of&nbsp;{data.count}
        </p>
      </Pagination>
    </>
  );
}

function ActionSelect<T>({
  actions,
  selectedRows,
  slug,
  onActionComplete,
}: Pick<CollectionType, "actions"> & {
  slug: string;
  selectedRows: T[];
  onActionComplete: () => void;
}) {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const { endpoint } = useServer();
  const queryClient = useQueryClient();

  const { action: actionDialogManager } = useDialogManager();

  const options: ComboboxOptionType[] = actions.map(({ label, name }) => ({
    label: label ?? name,
    value: name,
  }));

  const icons = useMemo(
    () =>
      actions.reduce<Record<string, any>>((prev, { icon, name }) => {
        prev[name] = HeroIcons[(icon as keyof typeof HeroIcons) ?? "BoltIcon"];
        return prev;
      }, {}),
    [actions],
  );

  const { mutate: fireAction } = useMutation({
    mutationFn: (action: string) =>
      endpoint.post(`/collections/${slug}/actions/${action}`, {
        items: selectedRows,
      }),
    onSuccess: () =>
      queryClient.refetchQueries({ queryKey: ["collections", slug] }),
    onError: (err, action) => {
      console.error(err);

      if (isAxiosError(err)) {
        toast.custom(({ visible }) => (
          <Toast
            severity="error"
            title={`${err.response?.status} ${err.code}`}
            message={err.response?.statusText}
            visible={visible}
          />
        ));
      } else
        toast.custom(({ visible }) => (
          <Toast
            severity="error"
            title={`Unable to run action - ${action}`}
            visible={visible}
          />
        ));
    },
  });

  return (
    <div className="w-[300px]">
      <Combobox
        options={options}
        placeholder={{ trigger: "Select an action" }}
        selected={selected}
        onSelectionChange={(sel) => {
          setSelected(sel ? String(sel) : undefined);

          if (sel) {
            const action = actions.find((action) => action.name === sel);

            if (!action) throw new Error(`Unable to find ${sel} action`);

            const actionHandler = () => {
              fireAction(action.name);
              setSelected(undefined);
              onActionComplete();
            };

            if (action.level) {
              let actionPropmt = {
                title: `Confirm ${action.label ?? action.name} Action`,
                message: "Are you sure you want to perform this action?",
              };

              if (typeof action.level !== "boolean")
                actionPropmt = action.level;

              actionDialogManager.setState({
                ...actionPropmt,
                show: true,
                action: actionHandler,
              });
            } else actionHandler();
          }
        }}
      >
        <ComboboxTrigger />
        <ComboboxContent>
          {({ option }) => {
            const val = String(option.value);

            const icon = icons[val as keyof typeof icons];

            return <CustomOption {...option} icon={icon} />;
          }}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function CustomOption({
  label,
  value,
  icon: Icon,
}: ComboboxOptionType & { icon: any }) {
  const { onSelectionChange } = useComboboxContext();

  return (
    <ComboboxItem
      value={String(value)}
      onSelect={onSelectionChange}
      className="gap-2"
    >
      <Icon className="size-3.5 stroke-2" />
      {label}
    </ComboboxItem>
  );
}
