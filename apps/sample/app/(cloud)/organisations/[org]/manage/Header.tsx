"use client";
import {
  ListPageHeader,
  getManageQueryKey,
  useQueryParams,
} from "@honohub/shared";
import type { StaticCollection } from "@honohub/shared";
import { useIsFetching } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export type ManagePageHeader = Pick<
  ListPageHeader,
  "name" | "icon" | "children"
> & {
  slug: StaticCollection.USERS | StaticCollection.ROLES;
};

export function ManagePageHeader({ slug, ...props }: ManagePageHeader) {
  const { org } = useParams();
  const params = useQueryParams();

  const queryKey = getManageQueryKey({
    org,
    slug,
    params,
  });

  const fetching = useIsFetching({ queryKey });
  const isFetching = fetching !== 0;

  return (
    <ListPageHeader {...props} queryKey={queryKey} isFetching={isFetching} />
  );
}
