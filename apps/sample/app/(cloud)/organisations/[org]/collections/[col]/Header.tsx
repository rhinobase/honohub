"use client";
import {
  ArchiveBoxIcon,
  BoltIcon,
  Square3Stack3DIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  ListPageHeader,
  getCollectionQueryKey,
  useCollection,
  useQueryParams,
} from "@honohub/shared";
import { Skeleton } from "@rafty/ui";
import { useParams, usePathname } from "next/navigation";

export function CollectionPageHeader() {
  const { org, col } = useParams();
  const pathname = usePathname();

  const { collections, current, isLoading, isError, isFetching } =
    useCollection();

  const queryParams = useQueryParams();

  const queryKey = getCollectionQueryKey({
    org,
    col,
    ...queryParams,
  });

  if (!collections || !current || isLoading || isError)
    return (
      <div className="flex items-center gap-2 lg:gap-3">
        <Skeleton className="h-10 w-36 rounded-md" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="size-10 rounded-md" />
      </div>
    );

  return (
    <ListPageHeader
      name={current?.name}
      icon={current?.icon}
      queryKey={queryKey}
      isFetching={isFetching}
      menuOptions={[
        {
          label: (
            <>
              <Square3Stack3DIcon className="size-4 stroke-2" />
              Query
            </>
          ),
          href: `${pathname}/query`,
        },
        {
          label: (
            <>
              <ArchiveBoxIcon className="size-4 stroke-2" />
              History
            </>
          ),
          href: `${pathname}/history`,
        },
        {
          label: (
            <>
              <TagIcon className="size-4 stroke-2" />
              Indexes
            </>
          ),
          href: `${pathname}/indexes`,
        },
        {
          label: (
            <>
              <BoltIcon className="size-4 stroke-2" />
              Actions
            </>
          ),
          href: `${pathname}/actions`,
        },
      ]}
    />
  );
}
