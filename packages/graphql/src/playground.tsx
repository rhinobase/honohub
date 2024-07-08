import type { AnyDrizzleDB } from "drizzle-graphql";
import GraphiQL from "graphiql";
import type { GlobalPlugin } from "honohub";

export type GraphQLEditorProps = {
  endpoint: string;
};

export default function GraphQLEditor(props: GraphQLEditorProps) {
  return (
    <GraphiQL
      fetcher={(graphQLParams) =>
        fetch(props.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(graphQLParams),
        }).then((response) => response.json())
      }
    />
  );
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
            import: "@honohub/graphql/playground",
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
