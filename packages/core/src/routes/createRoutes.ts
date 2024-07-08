import { zValidator } from "@hono/zod-validator";
import type { AnyDrizzleDB } from "drizzle-graphql";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import type { Table } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { createInsertSchema } from "drizzle-zod";
import { type Env, Hono, type Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import type { BlankSchema } from "hono/types";
import type { JSONValue } from "hono/utils/types";
import type { SanitizedCollection, SanitizedHub } from "../types";
import { queryValidationSchema } from "./validations";

export function createRoutes<
  Database extends AnyDrizzleDB<any>,
  U extends Table,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(config: SanitizedHub<Database>, collection: SanitizedCollection<U>) {
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
  const collectionDocumentCount = db
    .select({ count: count() })
    .from(collection.schema)
    .prepare(`${collection.slug}_count_query`);
  const collectionRetrieveQuery = db
    .select()
    .from(collection.schema)
    .where(eq(collection.queryKey, sql.placeholder("id")))
    .prepare(`${collection.slug}_retrieve_query`);
  const collectionDeleteQuery = db
    .delete(collection.schema)
    .where(eq(collection.queryKey, sql.placeholder("id")))
    .returning()
    .prepare(`${collection.slug}_delete_query`);

  // List records endpoint
  app.get("/", zValidator("query", queryValidationSchema), async (c) => {
    for (const hook of collection.hooks.beforeRead ?? []) {
      await hook({
        context: c,
      });
    }

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

    if (collection.pagination) {
      const limit = query.limit ?? collection.pagination.defaultLimit;

      if (
        collection.pagination.maxLimit &&
        limit > collection.pagination.maxLimit
      ) {
        throw new HTTPException(400, {
          message: "The limit value exceeds the maximum allowed limit.",
        });
      }

      records
        .limit(query.limit ?? collection.pagination.defaultLimit)
        .offset(query.offset);
    }

    let results = await records;

    for (const hook of collection.hooks.afterRead ?? []) {
      const res = await hook({
        context: c,
        doc: results,
      });

      // @ts-ignore
      if (res !== undefined) results = res;
    }

    return c.json(results);
  });

  // List records endpoint
  app.get("/count", async (c) =>
    c.json({
      totalDocs: await collectionDocumentCount
        .execute()
        .then((records) => records[0].count),
    }),
  );

  // Create record endpoint
  app.post("/", async (c) => {
    // Getting the raw data
    let raw = await (c.req.header("Content-Type") === "application/json"
      ? c.req.json()
      : c.req.formData());

    if (!raw)
      throw new HTTPException(404, {
        message: "Request body is missing or empty",
      });

    for (const hook of collection.hooks.beforeValidate ?? []) {
      const res = await hook({
        context: c,
        data: raw,
      });
      if (res !== undefined) raw = res;
    }

    // Parsing the value
    let data = collectionInsertSchema.parse(raw);

    for (const hook of collection.hooks.beforeChange ?? []) {
      const res = await hook({
        context: c,
        data,
      });

      // @ts-expect-error
      if (res !== undefined) data = res;
    }

    // Saving the record
    let createdDoc: any = await db
      .insert(collection.schema)
      .values(data)
      .returning();

    for (const hook of collection.hooks.afterChange ?? []) {
      const res = await hook({
        context: c,
        doc: createdDoc,
        previousDoc: data,
      });

      if (res !== undefined) createdDoc = res;
    }

    // Returning the response
    // @ts-ignore
    return c.json(createdDoc);
  });

  // Retrieve record endpoint
  app.get("/:id", async (c) => {
    for (const hook of collection.hooks.beforeRead ?? []) {
      await hook({
        context: c,
      });
    }

    // Getting the record
    let record = await collectionRetrieveQuery
      .execute({
        id: c.req.param("id"),
      })
      .then((records) => records[0]);

    if (!record)
      throw new HTTPException(404, { message: "Document not found" });

    for (const hook of collection.hooks.afterRead ?? []) {
      const res = await hook({
        context: c,
        doc: record,
      });

      // @ts-ignore
      if (res !== undefined) record = res;
    }

    // Returning the response
    return c.json(record);
  });

  // Update record endpoint
  app.patch("/:id", async (c) => {
    // Getting the raw data
    let raw = await (c.req.header("Content-Type") === "application/json"
      ? c.req.json()
      : c.req.formData());

    if (!raw)
      throw new HTTPException(404, {
        message: "Request body is missing or empty",
      });

    // Getting the original document
    const record = await collectionRetrieveQuery
      .execute({
        id: c.req.param("id"),
      })
      .then((records) => records[0]);

    if (!record)
      throw new HTTPException(404, { message: "Document not found" });

    for (const hook of collection.hooks.beforeValidate ?? []) {
      const res = await hook({
        context: c,
        data: raw,
        originalDoc: record,
      });
      if (res !== undefined) raw = res;
    }

    // Parsing the value
    let data = collectionInsertSchema.parse(raw);

    for (const hook of collection.hooks.beforeChange ?? []) {
      const res = await hook({
        context: c,
        data,
        originalDoc: record,
      });

      // @ts-expect-error
      if (res !== undefined) data = res;
    }

    // Updating the record
    let updatedDoc: any = await db
      .update(collection.schema)
      // @ts-expect-error
      .set(data)
      .where(eq(collection.queryKey, c.req.param("id")))
      .returning();

    for (const hook of collection.hooks.afterChange ?? []) {
      const res = await hook({
        context: c,
        doc: updatedDoc,
        previousDoc: data,
      });
      if (res !== undefined) updatedDoc = res;
    }

    // Returning the response
    // @ts-ignore
    return c.json(updatedDoc);
  });

  // Delete record endpoint
  app.delete("/:id", async (c) => {
    for (const hook of collection.hooks.beforeDelete ?? []) {
      await hook({ context: c });
    }

    // Deleting the record
    let deletedDoc: JSONValue = await collectionDeleteQuery.execute({
      id: c.req.param("id"),
    });

    for (const hook of collection.hooks.afterDelete ?? []) {
      // @ts-expect-error
      const res = await hook({ context: c, doc: deletedDoc });
      if (res !== undefined) deletedDoc = res;
    }

    // Returning the response
    // @ts-ignore
    return c.json(deletedDoc);
  });

  // Applying the plugins
  for (const plugin of collection.plugins) {
    const tmp = plugin.setup?.({ app, config: collection });
    if (tmp) app = tmp;
  }

  return app;
}
