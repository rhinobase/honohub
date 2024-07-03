import { serve } from "@hono/node-server";
import { defineApp, defineCollection } from "@honohub/core";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { todos } from "./db/schema";
import * as schema from "./db/schema";

const sql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(sql, { schema });

const collection = defineCollection({
  slug: "todos",
  schema: todos,
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
    ],
  }),
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
