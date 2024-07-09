import { createGraphiQLFetcher } from "@graphiql/toolkit";
import type { AnyDrizzleDB } from "drizzle-graphql";
import GraphiQL from "graphiql";
import type { GlobalPlugin } from "honohub";
import "graphiql/graphiql.css";
import { useMemo } from "react";

export type GraphQLEditorProps = {
  endpoint: string;
};

export function GraphQLEditor(props: GraphQLEditorProps) {
  const fetcher = useMemo(
    () => createGraphiQLFetcher({ url: props.endpoint }),
    [props.endpoint],
  );
  return <GraphiQL fetcher={fetcher} />;
}

export type GraphQLPlaygroundPluginConfig = {
  route?: string;
  graphQLEndpoint?: string;
};

export function useGraphQLPlayground<Database extends AnyDrizzleDB<any>>(
  config: GraphQLPlaygroundPluginConfig = {},
): GlobalPlugin<Database> {
  const { route = "/playground", graphQLEndpoint } = config;

  return {
    name: "honohub-graphql-playground",
    config(config) {
      return {
        ...config,
        routes: {
          ...config.routes,
          [route]: {
            import: {
              module: "@honohub/graphql/playground",
              component: "GraphQLEditor",
            },
            props(config): GraphQLEditorProps {
              return {
                endpoint: graphQLEndpoint ?? `${config.serverUrl}/graphql`,
              };
            },
          },
        },
      };
    },
  };
}
