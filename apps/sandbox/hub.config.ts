import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { defineCollection, defineHub } from "honohub";
import * as schema from "./src/db/schema";

const neonSql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(neonSql, { schema });

const collection = defineCollection({
  slug: "todos",
  schema: schema.todos,
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

export default defineHub({
  db,
  collections: [collection],
  plugins: [
    {
      name: "hono-logger",
      setup: (props) => {
        return new Hono().use("*", logger()).route("/", props.app);
      },
    },
    // useGraphql(),
  ],
});
