import type { AdminConfig, SanitizedAdmin } from "../types";

export function defineAdmin(config: AdminConfig) {
  const {
    serverURL,
    meta = {},
    dateFormat,
    routes = [],
    plugins = [],
  } = config;

  let sanitizedConfig: SanitizedAdmin = {
    serverURL,
    meta,
    dateFormat,
    routes,
    plugins,
  };

  for (const plugin of plugins) {
    const tmp = plugin.config?.(sanitizedConfig);
    if (tmp) sanitizedConfig = tmp;
  }

  return sanitizedConfig;
}
