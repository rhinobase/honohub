import { PlusIcon } from "@heroicons/react/24/outline";
import { Pagination, Searchbar } from "@honohub/shared";
import { type ColumnType, DataTable as SharedDatatable } from "@rafty/corp";
import { Button, Text } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { Blueprint, DuckForm } from "duck-form";
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { COLUMN_HEADER_COMPONENTS, FibrCellWrapper } from "../../columns";
import { useServer } from "../../providers";
import type { CollectionType } from "../../types";
import { queryValidation } from "../../validations";
import { ActionSelect } from "./ActionSelect";

export type CollectionDataTable<T> = {
  columns: ColumnType<T>[];
} & Pick<CollectionType, "slug" | "actions">;

export function CollectionDataTable<T = unknown>({
  columns,
  slug,
  actions,
}: CollectionDataTable<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { endpoint } = useServer();
  const [rowsSelected, setRowsSelected] = useState<Record<string, boolean>>({});
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
            selectedRows={selectedRows}
            slug={slug}
            onActionComplete={() => setRowsSelected({})}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Searchbar
            onChange={navigate}
            pathname={pathname}
            searchParams={searchParams}
          />
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
      <DuckForm components={COLUMN_HEADER_COMPONENTS}>
        <Blueprint wrapper={FibrCellWrapper}>
          <SharedDatatable
            data={data.results}
            columns={columns}
            isFetching={isFetching}
            isLoading={isLoading}
            enableRowSelection
            rowsSelected={rowsSelected}
            onRowsSelectedChange={setRowsSelected}
          />
        </Blueprint>
      </DuckForm>
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
        count={data.count}
        pageIndex={pageIndex}
        className="mb-14"
      />
    </>
  );
}
