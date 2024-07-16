import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { AnyDrizzleDB } from "drizzle-graphql";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedHub } from "honohub";

export async function generateReactTemplates<
  Database extends AnyDrizzleDB<any>,
>(config: SanitizedHub<Database>) {
  const generatedFiles = [];
  for (const page in config.routes) {
    const route = config.routes[page];

    const props = route.props?.(config);

    // Creating the dir
    await mkdir(resolve(config.build.cache, `./${page}`), { recursive: true });

    generatedFiles.push(
      // HTML file
      writeFile(
        resolve(
          process.cwd(),
          resolve(config.build.cache, `./${page}/index.html`),
        ),
        htmlTemplateCode({
          module: resolve(config.build.cache, `./${page}/main.jsx`),
          title: route.meta?.title ?? config.meta.title,
        }),
        {
          flag: "w+",
        },
      ),
      // Component file
      writeFile(
        resolve(
          process.cwd(),
          resolve(config.build.cache, `./${page}/main.jsx`),
        ),
        jsTemplateCode({
          import:
            typeof route.import === "string"
              ? `import DefaultComponent from "${route.import}"`
              : `import {${route.import.component}} from "${route.import.module}"`,
          component:
            typeof route.import === "string"
              ? "<DefaultComponent {...props} />"
              : `<${route.import.component} {...props} />`,
          props,
        }),
        {
          flag: "w+",
        },
      ),
    );
  }

  await Promise.all(generatedFiles);
}

type JSTemplateProps = {
  import: string;
  component: string;
  props?: JSONObject;
};

const jsTemplateCode = (props: JSTemplateProps) =>
  `import React from "react";import ReactDOM from "react-dom/client";${
    props.import
  };const props=${JSON.stringify(
    props.props ?? {},
  )};ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>${
    props.component
  }</React.StrictMode>);`;

type HTMLTemplateProps = {
  module: string;
  title?: string;
  icon?: string;
};

const htmlTemplateCode = (props: HTMLTemplateProps) =>
  `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${
    props.title ?? "Honohub"
  }</title></head><body><div id="root" ></div><script type="module" src="${
    props.module
  }"></script></body></html>`;
