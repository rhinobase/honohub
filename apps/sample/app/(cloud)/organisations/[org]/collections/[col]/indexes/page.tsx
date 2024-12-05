"use client";
import { ArrowPathIcon, PlusIcon, TagIcon } from "@heroicons/react/24/outline";
import {
  DataTable,
  PageHeader,
  useCollection,
  useCollectionIndexesData,
} from "@honohub/shared";
import { Button, eventHandler, useBoolean } from "@rafty/ui";
import { CreateIndexDialog } from "./CreateDialog";

const HEADERS: DataTable["headers"] = [
  {
    header: "Name & Definition",
    accessorKey: "name",
    type: "string",
  },
  {
    header: "Type",
    accessorKey: "type",
    type: "string",
  },
  {
    header: "Size",
    accessorKey: "size",
    type: "string",
  },
  {
    header: "Usage",
    accessorKey: "usage",
    type: "string",
  },
  {
    header: "Properties",
    accessorKey: "properties",
    type: "string",
  },
  {
    header: "Status",
    accessorKey: "status",
    type: "string",
  },
  {
    header: "Action",
    accessorKey: "key._id",
    type: "string",
  },
];

export default function CollectionIndexesPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useBoolean();
  const { current: currentCollection } = useCollection();

  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useCollectionIndexesData();

  const handleRefresh = eventHandler(() => refetch());

  const handleOpenCreateDialog = eventHandler(() => setCreateDialogOpen(true));

  return (
    <>
      <PageHeader
        icon={TagIcon}
        title={`Indexes${
          currentCollection ? ` of ${currentCollection.name.singular}` : ""
        }`}
      >
        <div className="flex-1" />
        <Button
          variant="ghost"
          leftIcon={<ArrowPathIcon className="size-5 stroke-2" />}
          isLoading={isFetching || isLoading}
          loadingText="Refreshing"
          onClick={handleRefresh}
          onKeyDown={handleRefresh}
        >
          Refresh
        </Button>
        <Button
          colorScheme="primary"
          leftIcon={<PlusIcon className="size-4 stroke-[3]" />}
          onClick={handleOpenCreateDialog}
          onKeyDown={handleOpenCreateDialog}
        >
          Create Index
        </Button>
      </PageHeader>
      <DataTable
        data={{ results: data, count: data.length }}
        headers={HEADERS}
        isLoading={isLoading}
        enableSearch={false}
        enablePagination={false}
        enableSelection={false}
      />
      <CreateIndexDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
