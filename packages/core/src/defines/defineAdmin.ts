import type { AdminConfig, SanitizedAdmin } from "../types";

const defaultBuildConfig = {
  cache: "./.honohub/generated",
  outDir: "../../dist",
};

export function defineAdmin(config: AdminConfig) {
  const {
    serverURL,
    meta = {},
    dateFormat,
    routes = {},
    plugins = [],
    build = {},
  } = config;

  let sanitizedConfig: SanitizedAdmin = {
    serverURL,
    meta,
    dateFormat,
    routes,
    plugins,
    build: { ...defaultBuildConfig, ...build },
  };

  for (const plugin of plugins) {
    const tmp = plugin.config?.(sanitizedConfig);
    if (tmp) sanitizedConfig = tmp;
  }

  return sanitizedConfig;
}
