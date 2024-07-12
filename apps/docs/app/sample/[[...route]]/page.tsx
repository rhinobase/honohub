"use client";
import { CollectionsPanel } from "@honohub/react";
import { useIsClient } from "@uidotdev/usehooks";

export default function SamplePage() {
  const isClient = useIsClient();

  if (!isClient) return;

  return (
    <CollectionsPanel
      serverUrl="https://api.spacexdata.com/v3"
      basePath="/sample"
      collections={[
        {
          slug: "launches",
          label: "Launches",
          columns: [
            {
              label: "Id",
              name: "flight_number",
              type: "custom_text",
            },
            {
              label: "Mission Name",
              name: "mission_name",
              type: "custom_text",
            },
            {
              label: "Launch Year",
              name: "launch_year",
              type: "custom_text",
            },
            {
              label: "Tentative",
              name: "is_tentative",
              type: "custom_text",
            },
            {
              label: "Launch Window",
              name: "launch_window",
              type: "custom_text",
            },
          ],
          fields: [
            {
              label: "Id",
              name: "flight_number",
              type: "string",
            },
            {
              label: "Mission Name",
              name: "mission_name",
              type: "string",
            },
            {
              label: "Launch Year",
              name: "launch_year",
              type: "string",
            },
            {
              label: "Tentative",
              name: "is_tentative",
              type: "string",
            },
            {
              label: "Launch Window",
              name: "launch_window",
              type: "string",
            },
          ],
        },
      ]}
    />
  );
}
