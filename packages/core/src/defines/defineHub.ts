import type { AnyDrizzleDB } from "drizzle-graphql";
import type { HubConfig, SanitizedHub } from "../types";

/**
 * Defines the Hub config
 *
 * @param config - The configuration object
 * @returns The sanitized hub configuration
 */
export function defineHub<Database extends AnyDrizzleDB<any>>(
  config: HubConfig<Database>,
): SanitizedHub<Database> {
  const {
    db,
    collections = [],
    plugins = [],
    serverUrl = "/",
    routes = [],
  } = config;

  let sanitizedConfig: SanitizedHub<Database> = {
    db,
    collections,
    plugins,
    serverUrl,
    routes,
  };

  for (const plugin of plugins) {
    try {
      const tmp = plugin.register?.(sanitizedConfig);
      if (tmp) sanitizedConfig = tmp;
    } catch (e) {
      console.error(`[${plugin.name}] Hub Plugin Registration Error`, e);
    }
  }

  return sanitizedConfig;
}
