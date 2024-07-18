import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CollectionType, HonoHubProps } from "@honohub/react";
import type { AnyDrizzleDB } from "drizzle-graphql";
import { getTableColumns, getTableName } from "drizzle-orm";
import type { SanitizedHub, ValueOf } from "honohub";

export type TemplateGeneratorProps<Database extends AnyDrizzleDB<any>> = {
  basePath: string;
  build: BuildOptions;
  config: SanitizedHub<Database>;
};

export type BuildOptions = { cache: string; outDir: string };

export async function generateReactTemplates<
  Database extends AnyDrizzleDB<any>,
>({ config, build, basePath }: TemplateGeneratorProps<Database>) {
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
  await mkdir(build.cache, { recursive: true });

  await Promise.all([
    // HTML file
    writeFile(
      join(process.cwd(), build.cache, "./index.html"),
      htmlTemplateCode({
        module: join(build.cache, "./main.jsx"),
      }),
      {
        flag: "w+",
      },
    ),
    // Component file
    writeFile(
      join(process.cwd(), build.cache, "./main.jsx"),
      jsTemplateCode({
        props: {
          basePath,
          serverUrl: config.serverUrl,
          plugins: pluginProps,
          collections: config.collections.map((collection) => {
            const columns = getTableColumns(collection.schema);

            const fieldMap: Record<
              string,
              {
                name: string;
                label: string;
                type: string;
                required: boolean;
              }
            > = {};

            for (const [key, column] of Object.entries(columns)) {
              const { name, notNull, dataType } = column as any;

              fieldMap[name] = {
                name: key,
                label: name,
                type: dataType,
                required: notNull,
              };
            }

            const collectionColumns =
              collection.admin.columns?.map((col: any) => {
                let tmp: ValueOf<typeof fieldMap>;
                if (typeof col === "string") tmp = fieldMap[String(col)];
                tmp = { ...fieldMap[String(col.name)], ...col };

                return {
                  name: tmp.name,
                  label: tmp.label,
                  type: tmp.type,
                };
              }) ?? Object.values(fieldMap);

            const fields =
              collection.admin.fields?.map((col: any) => {
                if (typeof col === "string") return fieldMap[String(col)];
                return { ...fieldMap[String(col.name)], ...col };
              }) ?? Object.values(fieldMap);

            return {
              slug: collection.slug,
              label: collection.admin.label ?? getTableName(collection.schema),
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
