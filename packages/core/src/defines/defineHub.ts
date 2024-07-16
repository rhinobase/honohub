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
    routes = [],
    build = {},
  } = config;

  let sanitizedConfig: SanitizedHub<Database> = {
    db,
    collections,
    plugins,
    serverUrl,
    routes,
    build: { ...defaultBuildConfig, ...build },
  };

  for (const plugin of plugins) {
    try {
      const tmp = plugin.register?.(sanitizedConfig);
      if (tmp) sanitizedConfig = tmp;
    } catch (e) {
      console.error(`Hub Plugin Registration Error in ${plugin.name}`);
      console.error(e);
    }
  }

  return sanitizedConfig;
}
