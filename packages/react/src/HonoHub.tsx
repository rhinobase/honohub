import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AppWrapper } from "./components/AppWrapper";
import { CollectionsWrapper } from "./components/CollectionsWrapper";
import { PluginWrapper } from "./components/PluginWrapper";
import "./main.css";
import {
  CollectionPage,
  CollectionsPage,
  DocumentPage,
  ErrorPage,
  HomePage,
  PluginsPage,
  SettingsPage,
} from "./pages";
import {
  PreferencesProvider,
  ServerProvider,
  ThemeProvider,
} from "./providers";
import type { CollectionType, PluginType } from "./types";

const CLIENT = new QueryClient();

export type HonoHub = {
  basePath: string;
  serverUrl: string;
  plugins?: PluginType;
  collections: CollectionType[];
  stats: {
    version: string;
    hono: string;
    collections: number;
    plugins: number;
    routes: number;
  };
};

export function HonoHub({
  plugins,
  basePath,
  collections,
  serverUrl,
  stats,
}: HonoHub) {
  const hasPlugins = plugins && Object.keys(plugins).length > 0;

  // const appWrapperOptions = {
  //   collections: [
  //     {
  //       icon: HeroIcon.ArchiveBoxIcon,
  //       label: "Collections",
  //       path:
  //         collections.length > 0
  //           ? `/collections/${collections[0].slug}`
  //           : "/collections",
  //     },
  //   ],
  //   ...(hasPlugins
  //     ? {
  //         plugins: Object.entries(plugins).map(([path, { label, icon }]) => ({
  //           // @ts-expect-error
  //           icon: icon ? HeroIcon[icon] : undefined,
  //           label,
  //           path,
  //         })),
  //       }
  //     : {}),
  //   general: [
  //     {
  //       icon: HeroIcon.Cog6ToothIcon,
  //       label: "Settings",
  //       path: "/settings",
  //     },
  //   ],
  // };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <AppWrapper />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <HomePage basePath={basePath} stats={stats} />,
          },
          {
            path: "/collections",
            element: <CollectionsPage options={collections} />,
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
          {
            path: "/plugins",
            element: <PluginsPage options={plugins} />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          ...(hasPlugins
            ? Object.entries(plugins).map<RouteObject>(([path, plugin]) => ({
                path: `/plugins${path}`,
                lazy: async () => {
                  const Panel = (await plugin.import) as any;

                  return {
                    element: (
                      <PluginWrapper name={plugin.label}>
                        <Panel {...plugin.props} />
                      </PluginWrapper>
                    ),
                  };
                },
              }))
            : []),
        ],
      },
    ],
    { basename: basePath },
  );

  return (
    <QueryClientProvider client={CLIENT}>
      <ThemeProvider>
        <ServerProvider baseURL={serverUrl}>
          <PreferencesProvider>
            <RouterProvider router={router} />
          </PreferencesProvider>
          <Toaster />
        </ServerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
