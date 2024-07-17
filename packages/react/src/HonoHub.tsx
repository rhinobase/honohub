import { ArchiveBoxIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AppWrapper, CollectionsWrapper } from "./components";
import { CollectionPage, DocumentPage, SettingsPage } from "./pages";
import { ThemeProvider } from "./providers";
import type { HonoHubProps } from "./types";
import "./main.css";

const CLIENT = new QueryClient();

export function HonoHub({
  plugins,
  basePath,
  collections,
  serverUrl,
}: HonoHubProps) {
  const hasPlugins = plugins && Object.keys(plugins).length > 0;

  const appWrapperOptions = {
    collections: [
      {
        icon: ArchiveBoxIcon,
        label: "Collections",
        path: "/collections",
      },
    ],
    ...(hasPlugins
      ? {
          plugins: Object.entries(plugins).map(([path, { label, icon }]) => ({
            icon,
            label,
            path,
          })),
        }
      : {}),
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
            element: <CollectionsWrapper options={collections} />,
            children: collections.flatMap((collection) => [
              {
                path: collection.slug,
                element: (
                  <CollectionPage {...collection} serverUrl={serverUrl} />
                ),
              },
              {
                path: `${collection.slug}/:id`,
                element: <DocumentPage {...collection} serverUrl={serverUrl} />,
              },
            ]),
          },
          ...(hasPlugins
            ? Object.entries(plugins).map<RouteObject>(([path, plugin]) => ({
                path,
                lazy: async () => {
                  let Panel: () => JSX.Element;

                  if (typeof plugin.import === "string")
                    Panel = await import(plugin.import);
                  else {
                    const { module, component } = plugin.import;
                    Panel = await import(module).then((mod) => mod[component]);
                  }

                  return {
                    element: <Panel {...plugin.props} />,
                  };
                },
              }))
            : []),
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
    { basename: basePath },
  );

  return (
    <QueryClientProvider client={CLIENT}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
