import { serve } from "@hono/node-server";
import { useGraphql } from "@honohub/graphql";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { defineApp, defineCollection } from "honohub";
import { todos } from "./db/schema";
import * as schema from "./db/schema";

const neonSql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(neonSql, { schema });

const collection = defineCollection({
  slug: "todos",
  schema: todos,
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

const app = new Hono().route(
  "/",
  defineApp({
    db,
    collections: [
      // @ts-expect-error
      collection,
    ],
    plugins: [
      (app) => {
        return new Hono().use(logger()).route("/", app);
      },
      useGraphql(),
    ],
  }),
);

app.get("/", (c) => {
  c.req.valid;
  return c.text("");
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
