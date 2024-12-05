import {
  ReferenceFilter,
  useManageRoleReferenceTypeData,
} from "@honohub/shared";
import { useLastElement } from "@rafty/ui";
import { useState } from "react";

export function RolesFilter() {
  const [search, setSearch] = useState<string>();

  const {
    data: permissions,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useManageRoleReferenceTypeData({
    search,
  });

  const data = permissions?.pages.flatMap((item) => item.results);

  const lastElementRef = useLastElement({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  return (
    <ReferenceFilter
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      label={{ singular: "Role", plural: "Roles" }}
      lastElementRef={lastElementRef}
      name="role"
      onSearchChange={setSearch}
    />
  );
}
