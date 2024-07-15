import { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { CollectionPage } from "./CollectionPage";
import { Create } from "./Create";
import { Edit } from "./Edit";
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
            path: `${collection.slug}/create`,
            element: <Create {...collection} />,
          },
          {
            path: `${collection.slug}/:id`,
            element: <Edit {...collection} />,
          },
        ]),
      },
    ],
    { basename: `${basePath}/collections` },
  );

  return <RouterProvider router={router} />;
}
