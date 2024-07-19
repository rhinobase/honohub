import * as HeroIcons from "@heroicons/react/24/outline";
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
import { Text } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useServer } from "../providers";
import type { CollectionType } from "../types";
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
  const { endpoint } = useServer();
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
      endpoint
        .get(`/collections/${slug}?limit=${pageSize}&offset=${offset}`)
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
          <ActionSelect actions={actions} />
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

function ActionSelect({ actions }: Pick<CollectionType, "actions">) {
  const { endpoint } = useServer();
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

  const slug = "todos";
  const ids: string[] = [];
  const fireAction = useCallback(
    (action: string) => {
      endpoint.post(`/collections/${slug}/actions/${action}`, { ids });
    },
    [endpoint],
  );

  return (
    <div className="w-[300px]">
      <Combobox options={options} placeholder={{ trigger: "Select an action" }}>
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
