import { ArchiveBoxIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AppWrapper, CollectionsWrapper } from "./components";
import "./main.css";
import {
  CollectionPage,
  DocumentPage,
  ErrorPage,
  HomePage,
  SettingsPage,
} from "./pages";
import { ServerProvider, ThemeProvider } from "./providers";
import type { HonoHubProps } from "./types";

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
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: (
              <HomePage
                basePath={basePath}
                stats={{
                  version: "0.1.0",
                  hono: "4.5.0",
                  collections: 1,
                  plugins: 0,
                  routes: 0,
                }}
              />
            ),
          },
          {
            path: "/collections",
            element: <CollectionsWrapper options={collections} />,
            children: collections.flatMap((collection) => [
              {
                path: collection.slug,
                element: <CollectionPage {...collection} />,
              },
              {
                path: `${collection.slug}/:id`,
                element: <DocumentPage {...collection} />,
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
        <ServerProvider baseURL={serverUrl}>
          <RouterProvider router={router} />
          <Toaster />
        </ServerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
