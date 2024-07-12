import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CollectionPage } from "./CollectionPage";
import { Create } from "./Create";
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
        ]),
      },
    ],
    { basename: basePath },
  );

  return <RouterProvider router={router} />;
}
