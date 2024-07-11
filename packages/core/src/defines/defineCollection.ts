import { type Table, getTableColumns, getTableName } from "drizzle-orm";
import type { CollectionConfig, SanitizedCollection } from "../types";

export function defineCollection<T extends Table>(
  config: CollectionConfig<T>,
): SanitizedCollection<T> {
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

  let sanitizedConfig: SanitizedCollection<T> = {
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

  for (const plugin of plugins) {
    const tmp = plugin.register?.(sanitizedConfig);
    if (tmp) sanitizedConfig = tmp;
  }

  return sanitizedConfig;
}

function findPrimaryKey<T extends Table>(table: T) {
  const columns = getTableColumns(table);

  for (const key in columns) {
    if (columns[key].primary) return columns[key];
  }

  throw new Error(
    `Unable to find primary key for ${getTableName(table)} table!`,
  );
}
