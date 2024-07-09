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
      if (command !== "build") return;

      const { cache, outDir } = hub.build;

      // Configuring the build
      config.root = cache;
      config.build = config.build || {};
      config.build.outDir = outDir;
      config.build.emptyOutDir = true;

      // Multiple entry files
      const inputs = Object.fromEntries(
        Object.keys(hub.routes).map((page) => [
          [page, resolve(__dirname, cache, `/${page}.html`)],
        ]),
      );

      config.build.rollupOptions = config.build.rollupOptions || {};
      config.build.rollupOptions.input = {
        ...(config.build.rollupOptions.input || ({} as any)),
        ...inputs,
      };

      // Creating the dir
      await mkdir(cache, { recursive: true });

      // Generating the files
      generator?.(hub);
    },
  };
}
