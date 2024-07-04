import { zValidator } from "@hono/zod-validator";
import type { AnyDrizzleDB } from "drizzle-graphql";
import { asc, desc, eq, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { createInsertSchema } from "drizzle-zod";
import { type Env, Hono, type Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import type { BlankSchema } from "hono/types";
import type {
  ExtendedTableConfig,
  SanitizedApp,
  SanitizedCollection,
} from "../types";
import { queryValidationSchema } from "./validations";

export function createRoutes<
  Database extends AnyDrizzleDB<any>,
  U extends ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(config: SanitizedApp<Database>, collection: SanitizedCollection<U>) {
  // Creating a new app
  let app = new Hono<E, P, I>().use(async (c, next) => {
    // Checking if we have access
    const hasAccess = await collection.access(c);

    // Throwing error if the req don't have access
    if (!hasAccess) throw new HTTPException(403, { message: "Access denied" });

    await next();
  });

  // Database instance
  const db = config.db as NeonHttpDatabase;

  // Generating the zod validation
  const collectionInsertSchema = createInsertSchema(collection.schema);

  // Prepared queries
  const collectionRetrieveQuery = db
    .select()
    .from(collection.schema)
    .where(eq(collection.queryKey, sql.placeholder("id")))
    .prepare(`${collection.slug}_retrieve_query`);
  const collectionDeleteQuery = db
    .delete(collection.schema)
    .where(eq(collection.queryKey, sql.placeholder("id")))
    .prepare(`${collection.slug}_delete_query`);

  // List records endpoint
  app.get("/", zValidator("query", queryValidationSchema), async (c) => {
    const query = c.req.valid("query");

    let records = db.select().from(collection.schema);

    records.$dynamic();

    if (query.search) {
      // TODO: Implement search
    }

    // Sorting the data
    const sortBy = query.sortBy ?? collection.defaultSort;
    let sortByInString = String(sortBy);

    let order: typeof desc;
    if (sortByInString.startsWith("-")) {
      sortByInString = sortByInString.slice(1);
      order = desc;
    } else {
      order = asc;
    }

    if (sortBy && sortByInString in collection.schema) {
      // @ts-expect-error
      records = records.orderBy(order(collection.schema[sortByInString]));
    }

    if (!collection.pagination) {
      return c.json(await records);
    }

    const limit = query.limit ?? collection.pagination.defaultLimit;

    if (
      collection.pagination.maxLimit &&
      limit > collection.pagination.maxLimit
    ) {
      throw new HTTPException(400, {
        message: "The limit value exceeds the maximum allowed limit.",
      });
    }

    const results = await records
      .limit(query.limit ?? collection.pagination.defaultLimit)
      .offset(query.offset);
    return c.json(results);
  });

  // Create record endpoint
  app.post("/", async (c) => {
    // Getting the raw data
    const raw = await (c.req.header("Content-Type") === "application/json"
      ? c.req.json()
      : c.req.formData());

    // Parsing the value
    const data = collectionInsertSchema.parse(raw);

    // Saving the record
    const response = await db
      .insert(collection.schema)
      .values(data)
      .returning({ insertedId: collection.queryKey });

    // Returning the response
    return c.json(response);
  });

  // Retrieve record endpoint
  app.get("/:id", async (c) => {
    // Getting the record
    const record = await collectionRetrieveQuery.execute({
      id: c.req.param("id"),
    });

    // Returning the response
    return c.json(record);
  });

  // Update record endpoint
  app.patch("/:id", async (c) => {
    // Getting the raw data
    const raw = await (c.req.header("Content-Type") === "application/json"
      ? c.req.json()
      : c.req.formData());

    // Parsing the value
    const data = collectionInsertSchema.parse(raw);

    // Updating the record
    const response = await db
      .update(collection.schema)
      // @ts-expect-error
      .set(data)
      .where(eq(collection.queryKey, c.req.param("id")))
      .returning({ updatedId: collection.queryKey });

    // Returning the response
    return c.json(response);
  });

  // Delete record endpoint
  app.delete("/:id", async (c) => {
    // Deleting the record
    await collectionDeleteQuery.execute({ id: c.req.param("id") });

    // Returning the response
    return c.json(null);
  });

  // Applying the plugins
  for (const plugin of collection.plugins) {
    app = plugin(app, collection);
  }

  return app;
}
