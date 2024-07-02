import type { Table } from "drizzle-orm";
import type { Env, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type {
  CollectionConfig,
  ExtendedTableConfig,
  SanitizedCollection,
} from "../types";

export function defineCollection<
  T extends ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(config: CollectionConfig<T, E, P, I>): SanitizedCollection<T, E, P, I> {
  const {
    slug,
    schema,
    queryKey = findPrimaryKey(schema),
    access = () => true,
    defaultSort,
    listSearchableFields = [],
    pagination = false,
    plugins = [],
    hooks = {},
  } = config;

  // Checking if paginations are correct
  if (pagination) {
    if (pagination.defaultLimit && pagination.defaultLimit <= 0)
      throw new Error("defaultLimit must be greater than zero.");
    if (pagination.maxLimit && pagination.maxLimit <= 0)
      throw new Error("maxLimit must be greater than zero.");
    if (
      pagination.maxLimit &&
      pagination.defaultLimit &&
      pagination.maxLimit < pagination.defaultLimit
    )
      throw new Error("maxLimit must be greater than defaultLimit.");
  }

  return {
    slug,
    schema,
    queryKey,
    access,
    defaultSort,
    listSearchableFields,
    pagination,
    plugins,
    hooks,
  };
}

function findPrimaryKey<T extends ExtendedTableConfig>(schema: Table<T>) {
  for (const key in schema) {
    // @ts-ignore
    const column = schema[key];
    if (column.primary) return column;
  }

  throw new Error(`Unable to find primary key for ${schema._.name} table!`);
}
