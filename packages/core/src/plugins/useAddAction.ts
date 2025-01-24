import type { CollectionAction, GlobalPlugin } from "../types";

export function useAddAction<
  T extends Record<string, unknown> = Record<string, unknown>,
  U = keyof T,
>(options: CollectionAction<T, U> | CollectionAction<T, U>[]): GlobalPlugin {
  return {
    name: "honohub-add-action",
    register(config) {
      return {
        ...config,
        collections: config.collections.map((collection) => ({
          ...collection,
          admin: {
            ...collection.admin,
            actions: [
              ...(collection.admin?.actions || []),
              ...(Array.isArray(options) ? options : [options]),
            ],
          },
        })),
      };
    },
  };
}
