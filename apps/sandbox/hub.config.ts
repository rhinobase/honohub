import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type Env, Hono, type Schema } from "hono";
import { logger } from "hono/logger";
import {
  type GlobalPluginSetupProps,
  defineCollection,
  defineHub,
} from "honohub";
import * as schema from "./src/db/schema";
// import { useGraphQL } from "@honohub/graphql";
// import { useGraphQLPlayground } from "@honohub/graphql/playground";

const neonSql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(neonSql, { schema });

const collection = defineCollection({
  slug: "todos",
  schema: schema.todos,
  queryKey: schema.todos.id,
  pagination: {
    defaultLimit: 10,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!Array.isArray(doc)) {
          return { id: doc.id, status: doc.status };
        }
        return undefined;
      },
    ],
  },
});

export default defineHub({
  db,
  serverUrl: "/",
  collections: [collection],
  plugins: [
    {
      name: "hono-logger",
      setup: <E extends Env, P extends Schema, I extends string>(
        props: GlobalPluginSetupProps<typeof db, E, P, I>,
      ) => {
        return new Hono<E, P, I>().use("*", logger()).route("/", props.app);
      },
    },
    // useGraphQL(),
    // useGraphQLPlayground(),
  ],
});
