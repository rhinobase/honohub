import { CollectionDocumentsTable } from "./Datatable";

export default function ListPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold capitalize">List</h1>
      <CollectionDocumentsTable />
    </div>
  );
}
