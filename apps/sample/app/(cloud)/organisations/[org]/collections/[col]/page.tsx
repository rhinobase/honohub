import { CollectionPermission, HasCrudPermission } from "@honohub/shared";
import { CollectionDataTable } from "./Datatable";
import { CollectionPageHeader } from "./Header";
import { CollectionPreviewProvider } from "./Preview";

export default function CollectionDetailPage() {
  return (
    <HasCrudPermission
      type={[CollectionPermission.LIST, CollectionPermission.VIEW]}
    >
      <CollectionPreviewProvider preview="list">
        <CollectionPageHeader />
        <CollectionDataTable />
      </CollectionPreviewProvider>
    </HasCrudPermission>
  );
}
