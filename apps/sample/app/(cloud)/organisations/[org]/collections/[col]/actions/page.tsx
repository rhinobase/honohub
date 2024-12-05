"use client";
import { ArrowPathIcon, BoltIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  DataTable,
  PageHeader,
  useCollection,
  useCollectionActionsData,
} from "@honohub/shared";
import { Button, classNames, eventHandler } from "@rafty/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HEADERS: DataTable["headers"] = [
  {
    accessorKey: "name",
    header: "Name",
    type: "string",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    type: "__icon",
  },
  {
    accessorKey: "label",
    header: "Label",
    type: "string",
  },
  {
    accessorKey: "created_on",
    header: "Created On",
    type: "datetime",
  },
  {
    accessorKey: "updated_on",
    header: "Updated On",
    type: "datetime",
  },
  {
    id: "action",
    accessorKey: "_id",
    header: "Action",
    type: "__manage_action",
  },
];

export default function CollectionActionsPage() {
  const pathname = usePathname();
  const { current: currentCollection } = useCollection();
  const { data, isLoading, isFetching, refetch } = useCollectionActionsData();

  const handleRefresh = eventHandler(() => refetch());

  return (
    <>
      <PageHeader
        title={`Actions${
          currentCollection ? ` of ${currentCollection.name.singular}` : ""
        }`}
        icon={BoltIcon}
      >
        <div className="flex-1" />
        <Button
          variant="ghost"
          leftIcon={
            <ArrowPathIcon
              className={classNames(
                isFetching && "animate-spin",
                "size-4 stroke-2",
              )}
            />
          }
          isLoading={isFetching}
          loadingText="Refreshing"
          onClick={handleRefresh}
          onKeyDown={handleRefresh}
        >
          Refresh
        </Button>
        <Link href={`${pathname}/create`}>
          <Button
            colorScheme="primary"
            leftIcon={<PlusIcon className="size-4 stroke-[3]" />}
          >
            Add Action
          </Button>
        </Link>
      </PageHeader>
      <DataTable
        headers={HEADERS}
        data={data}
        isLoading={isLoading}
        enableSelection={false}
      />
    </>
  );
}
