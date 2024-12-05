"use client";
import {
  DataTable,
  type StaticCollection,
  getManageQueryKey,
  queryValidation,
  useManageData,
  useQueryParams,
  userQueryValidation,
} from "@honohub/shared";
import { useParams } from "next/navigation";

export type ManageDataTable = Pick<DataTable, "headers"> & {
  slug: StaticCollection.USERS | StaticCollection.ROLES;
};

export function ManageDataTable({ headers, slug }: ManageDataTable) {
  const { org } = useParams();

  let validationSchema = queryValidation;

  if (slug === "users") validationSchema = userQueryValidation;

  const params = useQueryParams(validationSchema);

  const queryKey = getManageQueryKey({
    org,
    slug,
    params,
  });

  const { data, isLoading } = useManageData({
    slug,
  });

  return (
    <DataTable
      headers={headers}
      data={data}
      isLoading={isLoading}
      actionApiUrl={`/organisations/${org}/manage/${slug}/actions`}
      dataQueryKey={queryKey}
    />
  );
}
