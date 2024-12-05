"use client";
import {
  DataTable,
  PageHeader,
  useCollection,
  useCollectionDocumentHistory,
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

export default function CollectionHistoryPage() {
  const { current: currentCollection } = useCollection();
  const { data = [], isLoading } = useCollectionDocumentHistory();

  return (
    <>
      <PageHeader
        icon="history"
        title={`History ${
          currentCollection ? `of ${currentCollection.name.singular}` : ""
        }`}
      />
      <DataTable
        headers={HEADERS}
        data={{ results: data, count: data.length }}
        isLoading={isLoading}
        enableSearch={false}
        enableSelection={false}
      />
    </>
  );
}
