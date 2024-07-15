"use client";
import { AcademicCapIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useIsClient } from "@uidotdev/usehooks";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CollectionsPanel } from "./CollectionsPanel";
import { AppWrapper } from "./Wrapper";

// type PluginType = {
//   label: string;
//   icon?: string;
//   path: string;
//   routing?: string;
//   import: string | { module: string; component: string };
//   meta?: { title: string };
// };

export default function SamplePage() {
  const isClient = useIsClient();

  if (!isClient) return;

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <AppWrapper
            options={[
              {
                icon: AcademicCapIcon,
                label: "Collections",
                path: "/collections",
              },
              {
                icon: Cog6ToothIcon,
                label: "Settings",
                path: "/settings",
              },
            ]}
          />
        ),
        children: [
          {
            path: "/collections",
            element: <CollectionsPanel />,
          },
        ],
      },
    ],
    { basename: "/sample" },
  );

  return <RouterProvider router={router} />;
}
