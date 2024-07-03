import { zValidator } from "@hono/zod-validator";
import { type AnyDrizzleDB, buildSchema } from "drizzle-graphql";
import { graphql } from "graphql";
import { type Env, Hono, type Schema } from "hono";
import type { AppPlugin } from "honohub";
import { graphQLBodyValidation } from "./validation";

export type GraphQLPluginConfig = {
  route?: string;
};

export function useGraphql<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: GraphQLPluginConfig = {}): AppPlugin<Database, E, P, I> {
  const { route = "/graphql" } = config;

  return (_app, appConfig) => {
    const { schema } = buildSchema(appConfig.db);

    const app = new Hono<E, P, I>()
      .post(route, zValidator("json", graphQLBodyValidation), async (c) => {
        const data = c.req.valid("json");

        const response = await graphql({
          schema: schema,
          source: data.query,
        });

        return c.json(response);
      })
      .route("/", _app);

    return app;
  };
}
