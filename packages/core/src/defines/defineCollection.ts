import type { CollectionConfig, SanitizedCollection } from "../types";

/**
 * Defines the Collection config
 *
 * @param config - The configuration object
 * @returns The sanitized collection configuration
 */
export function defineCollection<
  T extends Record<string, unknown>,
  U = keyof T,
>(config: CollectionConfig<T, U>): SanitizedCollection<T, U> {
  const {
    schema,
    slug,
    admin = {},
    queryKey,
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

  const actions =
    admin?.actions && Array.isArray(admin.actions) ? admin.actions : [];

  let sanitizedConfig: SanitizedCollection<T, U> = {
    slug,
    admin: {
      ...admin,
      label: admin.label ?? slug,
      actions,
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
