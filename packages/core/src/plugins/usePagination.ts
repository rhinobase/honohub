import type { AnyDrizzleDB } from "drizzle-graphql";
import type { CollectionPagination, GlobalPlugin } from "../types";

export function usePagination<Database extends AnyDrizzleDB<any>>(
  options: CollectionPagination,
): GlobalPlugin<Database> {
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
