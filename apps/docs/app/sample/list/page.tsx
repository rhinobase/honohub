import { CollectionDocumentsTable } from "./Datatable";
import { ListPageHeader } from "./Header";

export default function ListPage() {
  return (
    <div className="flex flex-col min-h-0 w-full h-full flex-grow gap-[30px]">
      <ListPageHeader slug="demo" pluralLabel="demo" basepath="/sample" />
      <CollectionDocumentsTable />
    </div>
  );
}
