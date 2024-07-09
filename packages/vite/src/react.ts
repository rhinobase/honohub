import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedHub } from "honohub";

export async function generateReactTemplates(config: SanitizedHub) {
  const hubFiles = [];
  for (const page in config.routes) {
    const route = config.routes[page];

    const props = route.props?.(config);

    hubFiles.push(
      // HTML file
      writeFile(
        resolve(__dirname, config.build.cache, `/${page}.html`),
        htmlTemplateCode({
          module: `/${page}.js`,
          title: route.meta?.title ?? config.meta.title,
        }),
        {
          flag: "w+",
        },
      ),
      // Component file
      writeFile(
        resolve(__dirname, config.build.cache, `/${page}.js`),
        jsTemplateCode({
          import:
            typeof route.import === "string"
              ? `import DefaultComponent from "${route.import}"`
              : `import ${route.import.component} from "${route.import.module}"`,
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

  await Promise.all(hubFiles);
}

type JSTemplateProps = {
  import: string;
  component: string;
  props?: JSONObject;
};

const jsTemplateCode = (props: JSTemplateProps) =>
  `import React from "react";import ReactDOM from "react-dom/client";${
    props.import
  };const props=JSON.parse(${JSON.stringify(
    props.props ?? {},
  )});ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>${
    props.component
  }</React.StrictMode>);`;

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
