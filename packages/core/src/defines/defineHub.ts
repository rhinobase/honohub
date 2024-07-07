import type { AnyDrizzleDB } from "drizzle-graphql";
import type { HubConfig, SanitizedHub } from "../types";

export function defineHub<Database extends AnyDrizzleDB<any>>(
  config: HubConfig<Database>,
): SanitizedHub<Database> {
  const { db, collections = [], plugins = [] } = config;

  let sanitizedConfig = {
    db,
    collections,
    plugins,
  };

  for (const plugin of plugins) {
    const tmp = plugin.config?.(sanitizedConfig);
    if (tmp) sanitizedConfig = tmp;
  }

  return sanitizedConfig;
}
