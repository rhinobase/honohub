import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { AnyDrizzleDB } from "drizzle-graphql";
import type { SanitizedHub } from "honohub";
import type { PluginOption } from "vite";
import { generateReactTemplates } from "./react";

export type HonoHubViteOptions<Database extends AnyDrizzleDB<any>> = {
  config: SanitizedHub<Database>;
  generator?: (config: SanitizedHub<Database>) => void | Promise<void>;
};

export default function honohub<Database extends AnyDrizzleDB<any>>(
  options: HonoHubViteOptions<Database>,
): PluginOption {
  const { config: hub, generator = generateReactTemplates } = options;

  return {
    name: "honohub-vite-plugin",
    enforce: "pre",
    async config(config, { command }) {
      const routeKeys = Object.keys(hub.routes);
      if (command !== "build" || routeKeys.length === 0) return;

      const { cache, outDir } = hub.build;

      // Configuring the build
      config.root = cache;
      config.build = config.build || {};
      config.build.outDir = outDir;
      config.build.emptyOutDir = true;

      // Multiple entry files
      const inputs = Object.fromEntries(
        routeKeys.map((page) => [page, resolve(cache, `.${page}/index.html`)]),
      );

      config.build.rollupOptions = config.build.rollupOptions || {};
      config.build.rollupOptions.input = {
        ...(config.build.rollupOptions.input ?? ({} as any)),
        ...inputs,
      };

      const customRollupConfig: typeof config.build.rollupOptions.output = {
        entryFileNames: (chunk) => {
          const name = chunk.name.split("/").pop() ?? "index";
          return `${name}/index.js`;
        },
      };

      if (Array.isArray(config.build.rollupOptions.output)) {
        config.build.rollupOptions.output.push(customRollupConfig);
      } else
        config.build.rollupOptions.output = {
          ...(config.build.rollupOptions.output ?? {}),
          ...customRollupConfig,
        };

      // Creating the dir
      await mkdir(cache, { recursive: true });

      // Generating the files
      await generator?.(hub);
    },
  };
}
