"use client";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import {
  ActivitiesActionFilterMenu,
  DataTable,
  PageHeader,
  useCollection,
  useOrganizationActivitiesData,
} from "@honohub/shared";

const HEADERS: DataTable["headers"] = [
  {
    header: "Date & Time",
    accessorKey: "date",
    type: "datetime",
  },
  {
    header: "Action by",
    accessorKey: "user",
    type: "user",
  },
  {
    header: () => (
      <div className="w-full flex items-center justify-between">
        <p>Action</p>
        <ActivitiesActionFilterMenu />
      </div>
    ),
    accessorKey: "action",
    type: "__activity_action",
  },
  {
    header: "Event Id",
    accessorKey: "_id",
    type: "string",
  },
];

export default function CollectionHistoryPage() {
  const { current: currentCollection } = useCollection();

  const { data, isLoading } = useOrganizationActivitiesData({
    collectionId: [currentCollection?._id],
    isEnable: currentCollection?._id != null,
  });

  return (
    <>
      <PageHeader
        icon={ArchiveBoxIcon}
        title={`History${
          currentCollection ? ` of ${currentCollection.name.singular}` : ""
        }`}
      />
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
