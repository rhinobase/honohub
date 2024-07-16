import { AcademicCapIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppWrapper, CollectionsWrapper } from "./Components";
import { CollectionPage, DocumentPage } from "./Pages";

const COLLECTIONS_SERVER_URL = "https://api.spacexdata.com/v3";

const COLLECTIONS_OPTIONS = [
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
];

const CLIENT = new QueryClient();

export type Honohub = {
  plugins?: { label: string; path: string; icon?: string }[];
  basePath: string;
};

export function Honohub({ plugins, basePath }: Honohub) {
  const appWrapperOptions = {
    collections: [
      {
        icon: AcademicCapIcon,
        label: "Collections",
        path: "/collections",
      },
    ],
    ...(plugins && plugins.length > 0 ? { plugins } : {}),
    general: [
      {
        icon: Cog6ToothIcon,
        label: "Settings",
        path: "/settings",
      },
    ],
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <AppWrapper options={appWrapperOptions} />,
        children: [
          {
            path: "/collections",
            element: <CollectionsWrapper options={COLLECTIONS_OPTIONS} />,
            children: COLLECTIONS_OPTIONS.flatMap((collection) => [
              {
                path: collection.slug,
                element: (
                  <CollectionPage
                    {...collection}
                    serverUrl={COLLECTIONS_SERVER_URL}
                  />
                ),
              },
              {
                path: `${collection.slug}/:id`,
                element: (
                  <DocumentPage
                    {...collection}
                    serverUrl={COLLECTIONS_SERVER_URL}
                  />
                ),
              },
            ]),
          },
        ],
      },
    ],
    { basename: basePath },
  );

  return (
    <QueryClientProvider client={CLIENT}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
