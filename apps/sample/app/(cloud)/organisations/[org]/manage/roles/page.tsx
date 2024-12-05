import { StaticCollection } from "@honohub/shared";
import { ManageDataTable } from "../Datatable";
import { ManagePageHeader } from "../Header";

const ROLE_HEADER: ManageDataTable["headers"] = [
  {
    accessorKey: "name",
    header: "Name",
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

export default function RolesPage() {
  const slug = StaticCollection.ROLES;

  return (
    <>
      <ManagePageHeader
        icon="lock_open"
        name={{
          plural: "Roles",
          singular: "Role",
        }}
        slug={slug}
      />
      <ManageDataTable headers={ROLE_HEADER} slug={slug} />
    </>
  );
}
