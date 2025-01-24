import type { HubConfig, SanitizedHub } from "../types";

/**
 * Defines the Hub config
 *
 * @param config - The configuration object
 * @returns The sanitized hub configuration
 */
export function defineHub(config: HubConfig): SanitizedHub {
  const {
    db,
    collections = [],
    plugins = [],
    serverUrl = "/",
    routes = [],
  } = config;

  let sanitizedConfig: SanitizedHub = {
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
