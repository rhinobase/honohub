import type { CollectionPagination, GlobalPlugin } from "../types";

export function usePagination(options: CollectionPagination): GlobalPlugin {
  return {
    name: "honohub-pagination",
    register(config) {
      return {
        ...config,
        collections: config.collections.map((collection) => ({
          ...collection,
          pagination: {
            ...options,
            ...collection.pagination,
          },
        })),
      };
    },
  };
}
