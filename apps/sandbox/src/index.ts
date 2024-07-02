import { defineApp, defineCollection } from "@ganga/core";
import { serve } from "@hono/node-server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
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
      // defineCollection({ slug: "messages", schema: messages }),
    ],
  }),
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
