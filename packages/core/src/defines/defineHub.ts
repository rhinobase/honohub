import type { AnyDrizzleDB } from "drizzle-graphql";
import type { HubConfig, SanitizedHub } from "../types";

const defaultBuildConfig = {
  cache: "./.honohub",
  outDir: "../dist",
};

export function defineHub<Database extends AnyDrizzleDB<any>>(
  config: HubConfig<Database>,
): SanitizedHub<Database> {
  const {
    db,
    collections = [],
    plugins = [],
    serverUrl,
    meta = {},
    routes = {},
    build = {},
  } = config;

  let sanitizedConfig: SanitizedHub<Database> = {
    db,
    collections,
    plugins,
    serverUrl,
    meta,
    routes,
    build: { ...defaultBuildConfig, ...build },
  };

  for (const plugin of plugins) {
    const tmp = plugin.config?.(sanitizedConfig);
    if (tmp) sanitizedConfig = tmp;
  }

  return sanitizedConfig;
}
