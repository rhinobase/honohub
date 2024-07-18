import { type Table, getTableColumns, getTableName } from "drizzle-orm";
import type { CollectionConfig, SanitizedCollection } from "../types";

export function defineCollection<T extends Table>(
  config: CollectionConfig<T>,
): SanitizedCollection<T> {
  const {
    slug,
    admin = {},
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
    admin: {
      ...admin,
      label: admin.label ?? slug,
      actions: [
        ...(admin.actions ?? []),
        {
          name: "bulk_delete",
          label: "Bulk Delete",
          icon: "TrashIcon",
          level: true,
          action: (ids) => {
            console.log(ids);
          },
        },
      ],
    },
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
    try {
      const tmp = plugin.register?.(sanitizedConfig);
      if (tmp) sanitizedConfig = tmp;
    } catch (e) {
      console.error(`[${plugin.name}] Collection Plugin Registration Error`, e);
    }
  }

  return sanitizedConfig;
}

function findPrimaryKey<T extends Table>(table: T) {
  const columns = getTableColumns(table);

  for (const [_, column] of Object.entries(columns)) {
    if (column.primary) return column;
  }

  throw new Error(
    `Unable to find primary key for ${getTableName(table)} table!`,
  );
}
