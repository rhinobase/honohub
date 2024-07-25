import { mkdir } from "node:fs/promises";
import type { AnyDrizzleDB } from "drizzle-graphql";
import type { SanitizedHub } from "honohub";
import type { PluginOption } from "vite";
import {
  type BuildOptions,
  type TemplateGeneratorProps,
  generateReactTemplates,
} from "./react";

/**
 * Options for configuring HonoHub Vite.
 *
 * @template Database - The type of the database used by HonoHub.
 * @property {SanitizedHub<Database>} config - The sanitized configuration for HonoHub.
 * @property {string} [basePath] - The base path of the admin panel.
 * @property {string} [override] - The import override option.
 * @property {Partial<BuildOptions>} [build] - The build options.
 * @property {(options: TemplateGeneratorProps<Database>) => void | Promise<void>} [generator] - The template generator function.
 */
export type HonoHubViteOptions<Database extends AnyDrizzleDB<any>> = {
  config: SanitizedHub<Database>;
  basePath?: string;
  override?: string;
  build?: Partial<BuildOptions>;
  generator?: (
    options: TemplateGeneratorProps<Database>,
  ) => void | Promise<void>;
};

const defaultBuildProps: BuildOptions = {
  cache: "./.honohub",
  outDir: "../dist",
};

export default function honohub<Database extends AnyDrizzleDB<any>>(
  options: HonoHubViteOptions<Database>,
): PluginOption {
  const {
    config: hub,
    build = {},
    basePath = "/",
    generator = generateReactTemplates,
  } = options;

  const buildProps = { ...defaultBuildProps, ...build };

  return {
    name: "honohub-vite-plugin",
    enforce: "pre",
    async config(config) {
      // Configuring the build
      config.root = buildProps.cache;
      config.build = config.build || {};
      config.build.outDir = buildProps.outDir;
      config.build.emptyOutDir = true;

      // Creating the dir
      await mkdir(buildProps.cache, { recursive: true });

      // Generating the files
      await generator?.({
        basePath,
        config: hub,
        build: buildProps,
        override: options.override,
      });
    },
  };
}
