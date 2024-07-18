// import { useGraphQL, useGraphQLPlayground } from "@honohub/graphql";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type Env, Hono, type Schema } from "hono";
import { logger } from "hono/logger";
import {
  type GlobalPluginSetupProps,
  defineCollection,
  defineHub,
} from "../../packages/core/src";
import * as schema from "./src/db/schema";

const neonSql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(neonSql, { schema });

const collection = defineCollection({
  slug: "todos",
  admin: {
    label: { singular: "Todo", plural: "Todos" },
    fields: ["message", "status"],
  },
  schema: schema.todos,
  queryKey: schema.todos.id,
  pagination: {
    defaultLimit: 10,
  },
});

export default defineHub({
  db,
  serverUrl: "http://localhost:3000/",
  collections: [collection],
  plugins: [
    {
      name: "hono-logger",
      bootstrap: <E extends Env, P extends Schema, I extends string>(
        props: GlobalPluginSetupProps<typeof db, E, P, I>,
      ) => {
        return new Hono<E, P, I>().use("*", logger()).route("/", props.app);
      },
    },
    // useGraphQL(),
    // useGraphQLPlayground(),
  ],
});
