import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { SanitizedAdmin } from "honohub";
import type { PluginOption } from "vite";

export type HubOptions = {
  admin: SanitizedAdmin;
  cache?: string;
  outDir?: string;
};

export default function honohub(options: HubOptions): PluginOption {
  const {
    admin,
    cache = "./.honohub/generated",
    outDir = "../../dist",
  } = options;

  return {
    name: "honohub-vite-plugin",
    enforce: "pre",
    async config(config, { command }) {
      config.root = cache;

      if (command !== "build") return;

      // Configuring the build
      config.build = config.build || {};
      config.build.outDir = outDir;
      config.build.emptyOutDir = true;

      // Multiple entry files
      const inputs = Object.fromEntries(
        admin.routes.map(({ page }) => [
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
      const files = [];
      for (const route of admin.routes) {
        files.push(
          // HTML file
          writeFile(
            resolve(__dirname, cache, `/${route.page}.html`),
            htmlTemplateCode({
              module: `/${route.page}.js`,
              title: admin.meta.titleSuffix,
            }),
            {
              flag: "w+",
            },
          ),
          // Component file
          writeFile(
            resolve(__dirname, cache, `/${route.page}.js`),
            jsTemplateCode({
              import:
                typeof route.import === "string"
                  ? `import DefaultComponent from "${route.import}"`
                  : `import ${route.import.component} from "${route.import.module}"`,
              component:
                typeof route.import === "string"
                  ? "<DefaultComponent />"
                  : `<${route.import.component} />`,
            }),
            {
              flag: "w+",
            },
          ),
        );
      }
    },
  };
}

type JSTemplateProps = { import: string; component: string };

const jsTemplateCode = (props: JSTemplateProps) =>
  `import React from "react";import ReactDOM from "react-dom/client";${props.import};ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>${props.component}</React.StrictMode>);`;

type HTMLTemplateProps = {
  module: string;
  title?: string;
  icon?: string;
};

const htmlTemplateCode = (props: HTMLTemplateProps) =>
  `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><link rel="icon" type="image/svg+xml" href="/vite.svg" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${
    props.title ?? "Honohub"
  }</title></head><body><div id="root" /><script type="module" src="${
    props.module
  }"></script></body></html>`;
