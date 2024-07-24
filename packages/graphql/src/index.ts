import { zValidator } from "@hono/zod-validator";
import { type AnyDrizzleDB, buildSchema } from "drizzle-graphql";
import { graphql } from "graphql";
import type { GlobalPlugin } from "honohub";
import { z } from "zod";
import type { GraphQLEditorProps } from "./playground";

export const graphQLBodyValidation = z.object({
  operationName: z.string().optional(),
  query: z.string(),
  variables: z.record(z.string(), z.any()).optional(),
});

export type GraphQLPluginConfig = {
  route?: string;
  playground?:
    | boolean
    | {
        route?: string;
        graphQLEndpoint?: string;
      };
};

const defaultPlaygroundOptions = {
  route: "/playground",
  graphQLEndpoint: "/graphql",
};

export function useGraphQL<Database extends AnyDrizzleDB<any>>(
  options: GraphQLPluginConfig = {},
): GlobalPlugin<Database> {
  const { route = "/graphql" } = options;

  return {
    name: "honohub-graphql",
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
    register(config) {
      if (!options.playground) return undefined;

      const { route: playgroundRoute, graphQLEndpoint } = {
        ...defaultPlaygroundOptions,
        ...(typeof options.playground !== "boolean" ? options.playground : {}),
      };

      return {
        ...config,
        routes: [
          ...config.routes,
          {
            icon: "CodeBracketSquareIcon",
            label: "GraphQL Editor",
            path: playgroundRoute,
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
