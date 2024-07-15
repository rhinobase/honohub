import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CollectionPage } from "./CollectionPage";
import { Document } from "./Document";
import { CollectionsWrapper } from "./Wrapper";
import type { CollectionType } from "./types";

export type CollectionsPanel = {
  basePath: string;
  collections: CollectionType[];
  serverUrl: string;
};

export function CollectionsPanel({
  collections,
  basePath,
  serverUrl,
}: CollectionsPanel) {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <CollectionsWrapper options={collections} />,
        children: collections.flatMap((collection) => [
          {
            path: collection.slug,
            element: <CollectionPage {...collection} serverUrl={serverUrl} />,
          },
          {
            path: `${collection.slug}/:id`,
            element: <Document {...collection} serverUrl={serverUrl} />,
          },
        ]),
      },
    ],
    { basename: `${basePath}/collections` },
  );

  return <RouterProvider router={router} />;
}
