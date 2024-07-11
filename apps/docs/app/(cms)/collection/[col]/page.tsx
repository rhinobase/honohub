"use client";
import { CollectionViewPage } from "@honohub/react";
import { Checkbox } from "@rafty/ui";

const COLUMNS = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() || table.getIsSomeRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={() => table.toggleAllRowsSelected()}
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
      />
    ),
    size: 30,
  },
  {
    header: "Id",
    accessorKey: "flight_number",
  },
  {
    header: "Mission Name",
    accessorKey: "mission_name",
  },
  {
    header: "Launch Year",
    accessorKey: "launch_year",
  },
  {
    header: "Tentative",
    accessorKey: "is_tentative",
  },
  {
    header: "Launch Window",
    accessorKey: "launch_window",
  },
  {
    header: "Rocket Name",
    cell: ({ row }: any) => row.original.rocket.rocket_name,
  },
];

export default function CollectionPage() {
  return (
    <CollectionViewPage
      endpoint="https://api.spacexdata.com/v3/launches"
      columns={COLUMNS}
    />
  );
}
