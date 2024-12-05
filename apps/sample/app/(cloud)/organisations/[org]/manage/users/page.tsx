"use client";
import { FiltersPanelToggleButton, StaticCollection } from "@honohub/shared";
import { useBoolean } from "@rafty/ui";
import { ManageDataTable } from "../Datatable";
import { ManagePageHeader } from "../Header";
import { UserFiltersPanel } from "./FiltersPanel";

const USER_HEADER: ManageDataTable["headers"] = [
  {
    accessorKey: "email",
    header: "Email",
    type: "string",
  },
  {
    accessorKey: "displayName",
    header: "Name",
    type: "string",
  },
  {
    accessorKey: "superuser",
    header: "Superuser",
    type: "boolean",
  },
  {
    accessorKey: "staff",
    header: "Staff",
    type: "boolean",
  },
  {
    accessorKey: "disabled",
    header: "Disabled",
    type: "boolean",
  },
  {
    accessorKey: "lastSignInTime",
    header: "Last Sign In Time",
    type: "datetime",
  },
  {
    accessorKey: "creationTime",
    header: "Created On",
    type: "datetime",
  },
  {
    id: "action",
    accessorKey: "_id",
    header: "Action",
    type: "__manage_action",
  },
];

export default function UsersPage() {
  const slug = StaticCollection.USERS;
  const [isFilterOpen, setFilterOpen] = useBoolean();

  return (
    <>
      <ManagePageHeader
        icon="account_circle"
        name={{
          plural: "Users",
          singular: "User",
        }}
        slug={slug}
      >
        <FiltersPanelToggleButton
          isActive={isFilterOpen}
          onInteract={setFilterOpen}
        />
      </ManagePageHeader>
      <div className="flex h-full gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-x-auto overflow-y-hidden">
        <div className="w-full flex h-full flex-col gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          <ManageDataTable headers={USER_HEADER} slug={slug} />
        </div>
        {isFilterOpen && <UserFiltersPanel />}
      </div>
    </>
  );
}
