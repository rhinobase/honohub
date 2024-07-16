import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CollectionType, HonoHubProps } from "@honohub/react";
import type { AnyDrizzleDB } from "drizzle-graphql";
import { getTableColumns, getTableName } from "drizzle-orm";
import type { SanitizedHub } from "honohub";

export type TemplateGeneratorProps<Database extends AnyDrizzleDB<any>> = {
  basePath: string;
  config: SanitizedHub<Database>;
};

export async function generateReactTemplates<
  Database extends AnyDrizzleDB<any>,
>({ config, basePath }: TemplateGeneratorProps<Database>) {
  const pluginProps: NonNullable<HonoHubProps["plugins"]> = {};

  for (const page in config.routes) {
    const route = config.routes[page];

    pluginProps[route.path] = {
      label: route.label,
      icon: route.icon,
      import: route.import,
      props:
        (route.props && typeof route.props === "function"
          ? route.props(config)
          : route.props) ?? {},
    };
  }

  // Creating the dir
  await mkdir(config.build.cache, { recursive: true });

  await Promise.all([
    // HTML file
    writeFile(
      resolve(process.cwd(), resolve(config.build.cache, "./index.html")),
      htmlTemplateCode({
        module: resolve(config.build.cache, "./main.jsx"),
      }),
      {
        flag: "w+",
      },
    ),
    // Component file
    writeFile(
      resolve(process.cwd(), resolve(config.build.cache, "./main.jsx")),
      jsTemplateCode({
        props: {
          basePath,
          serverUrl: config.serverUrl,
          plugins: pluginProps,
          collections: config.collections.map((collection) => {
            const columns = getTableColumns(collection.schema);

            const fields: CollectionType["fields"] = [];
            const fieldMap: Record<string, CollectionType["columns"][0]> = {};

            for (const [_, column] of Object.entries(columns)) {
              const { uniqueName, name, notNull, dataType } = column as any;

              const common_data = {
                name: uniqueName,
                label: name,
                type: dataType,
              };

              fieldMap[name] = common_data;
              fields.push({
                ...common_data,
                required: notNull,
              });
            }

            const collectionColumns: CollectionType["columns"] =
              collection.columns?.map((key) => fieldMap[String(key)]) ??
              Object.values(fieldMap);

            return {
              slug: collection.slug,
              label: collection.label ?? getTableName(collection.schema),
              columns: collectionColumns,
              fields: fields,
            };
          }),
        },
      }),
      {
        flag: "w+",
      },
    ),
  ]);
}

type JSTemplateProps = {
  props: HonoHubProps;
};

const jsTemplateCode = ({ props }: JSTemplateProps) =>
  `import React from "react";import ReactDOM from "react-dom/client";import {HonoHub} from "@honohub/react";const props=${JSON.stringify(
    props,
  )};ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><HonoHub {...props} /></React.StrictMode>);`;

type HTMLTemplateProps = {
  module: string;
  title?: string;
  icon?: string;
};

const htmlTemplateCode = (props: HTMLTemplateProps) =>
  `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>HonoHub</title></head><body><div id="root" ></div><script type="module" src="${props.module}"></script></body></html>`;
