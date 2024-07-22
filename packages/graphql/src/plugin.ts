import { zValidator } from "@hono/zod-validator";
import { type AnyDrizzleDB, buildSchema } from "drizzle-graphql";
import { graphql } from "graphql";
import type { GlobalPlugin } from "honohub";
import type { GraphQLEditorProps } from "./playground";
import { graphQLBodyValidation } from "./validation";

export type GraphQLPluginConfig = {
  route?: string;
};

export function useGraphQL<Database extends AnyDrizzleDB<any>>(
  config: GraphQLPluginConfig = {},
): GlobalPlugin<Database> {
  const { route = "/graphql" } = config;

  return {
    name: "honohub-graphql-api",
    bootstrap(props) {
      const { schema } = buildSchema(props.config.db);

      props.app.post(
        route,
        zValidator("json", graphQLBodyValidation),
        async (c) => {
          const data = c.req.valid("json");

          const response = await graphql({
            schema: schema,
            source: data.query,
          });

          return c.json(response);
        },
      );

      return props.app;
    },
  };
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
    register(config) {
      return {
        ...config,
        routes: [
          ...config.routes,
          {
            icon: "CodeBracketSquareIcon",
            label: "GraphQL Editor",
            path: route,
            // import: "@honohub/graphql/playground",
            import: "../../graphql/src/playground.tsx",
            props(config): GraphQLEditorProps {
              return {
                endpoint: graphQLEndpoint ?? `${config.serverUrl}/graphql`,
              };
            },
          },
        ],
      };
    },
  };
}
