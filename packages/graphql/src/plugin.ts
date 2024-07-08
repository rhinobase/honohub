import { zValidator } from "@hono/zod-validator";
import { type AnyDrizzleDB, buildSchema } from "drizzle-graphql";
import { graphql } from "graphql";
import type { GlobalPlugin } from "honohub";
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
    setup: (props) => {
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
