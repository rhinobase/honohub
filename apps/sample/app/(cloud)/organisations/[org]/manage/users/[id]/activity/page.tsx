"use client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  ActivitiesActionFilterMenu,
  DataTable,
  PageHeader,
  useOrganizationActivitiesData,
} from "@honohub/shared";
import { Button, eventHandler } from "@rafty/ui";
import { useParams } from "next/navigation";

const HEADERS: DataTable["headers"] = [
  {
    accessorKey: "date",
    header: "Date & Time",
    type: "datetime",
  },
  {
    accessorKey: "user",
    header: "Action By",
    type: "user",
  },
  {
    accessorKey: "collection.name",
    header: "Collection",
    type: "default",
  },
  {
    accessorKey: "action",
    header: () => (
      <div className="w-full flex items-center justify-between">
        <p>Action</p>
        <ActivitiesActionFilterMenu />
      </div>
    ),
    type: "__activity_action",
  },
  {
    accessorKey: "collection",
    header: "Document",
    type: "__activity_document",
  },
];

export default function UserActivityPage() {
  const { id } = useParams();
  const { data, isLoading, isFetching, refetch } =
    useOrganizationActivitiesData({
      userId: [String(id)],
    });

  const handleRefresh = eventHandler(() => refetch());

  return (
    <>
      <PageHeader icon="history" title="Recent Activities">
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
      </PageHeader>
      <DataTable
        headers={HEADERS}
        data={data}
        isLoading={isLoading}
        enableSearch={false}
        enableSelection={false}
      />
    </>
  );
}
