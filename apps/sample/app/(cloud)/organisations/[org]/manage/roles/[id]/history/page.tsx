"use client";
import {
  DataTable,
  PageHeader,
  StaticCollection,
  useManageHistory,
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
    header: "Action",
    accessorKey: "action",
    type: "__activity_action",
  },
  {
    header: "Event Id",
    accessorKey: "_id",
    type: "string",
  },
];

export default function RoleHistoryPage() {
  const { data, isLoading } = useManageHistory({
    slug: StaticCollection.ROLES,
  });

  return (
    <>
      <PageHeader icon="history" title="History of Role" />
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
