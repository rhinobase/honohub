import type { CollectionConfig } from "./collection";

export type Driver = {
  collection: <
    T extends Record<string, unknown> = Record<string, unknown>,
    U = keyof T,
  >(
    config: CollectionConfig<T, U>,
  ) => DriverCollection;
};

export type DriverCollection = {
  list: <T>(
    options?: Partial<ListQueryOptions>,
  ) => Promise<{ results: T[]; count: number } | T[]>;
  count: () => Promise<number>;
  //   create: <T>(values: T) => Promise<T>;
  //   retrieve: <T>(id: string | number) => Promise<T>;
  //   update: <T>(id: string | number, values: T) => Promise<T>;
  //   delete: <T>(id: string | number) => Promise<T>;
};

export type ListQueryOptions = {
  limit: number;
  offset: number;
  search: string;
  sortBy: string;
};
