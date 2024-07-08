import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type Env, Hono, type Schema } from "hono";
import { logger } from "hono/logger";
import {
  type GlobalPluginSetupProps,
  type SanitizedHub,
  defineCollection,
  defineHub,
} from "honohub";
import * as schema from "./src/db/schema";

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
      },
    ],
  },
});

db._.fullSchema.todos;

export default defineHub({
  db,
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
    // useGraphql(),
  ],
});
