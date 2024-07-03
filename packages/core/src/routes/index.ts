import { zValidator } from "@hono/zod-validator";
import type { AnyDrizzleDB } from "drizzle-graphql";
import { asc, desc, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { type Env, Hono, type Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import type { BlankSchema } from "hono/types";
import { z } from "zod";
import type {
  ExtendedTableConfig,
  Promisify,
  SanitizedApp,
  SanitizedCollection,
} from "../types";
import { AccessType } from "../utils";
import { operationsMiddleware } from "./middlewares";
import { queryValidationSchema } from "./validations";

export function createRoutes<
  Database extends AnyDrizzleDB<any>,
  U extends ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(
  config: SanitizedApp<Database, E, P, I>,
  collection: SanitizedCollection<U, E, P, I>,
) {
  // Creating a new app
  let app = new Hono<E, P, I>();

  const db = config.db as any;

  // List records endpoint
  app.get(
    "/",
    zValidator("query", queryValidationSchema),
    operationsMiddleware(collection, AccessType.LIST),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.LIST));

      const query = c.req.valid("query");

      let records = db.select().from(collection.schema);

      records.$dynamic();

      if (query.search) {
        // TODO: Implement search
      }

      // Sorting the data
      const sortBy = query.sortBy ?? collection.defaultSort;
      let sortByInString = String(sortBy);

      if (sortBy && sortByInString in collection.schema) {
        let order: typeof desc;
        if (sortByInString.startsWith("-")) {
          sortByInString = sortByInString.slice(1);
          order = desc;
        } else {
          order = asc;
        }

        // @ts-expect-error
        records = records.orderBy(order(collection.schema[sortByInString]));
      }

      if (!collection.pagination) {
        return c.json(await records);
      }

      const results = await records.limit(query.limit).offset(query.offset);
      return c.json(results);
    },
  );

  // Create record endpoint
  app.post(
    "/",
    operationsMiddleware(collection, AccessType.CREATE),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.CREATE));

      // Generating the zod validation
      const validation = createInsertSchema(collection.schema);

      // Getting the raw data
      const raw = await (c.req.header("Content-Type") === "application/json"
        ? c.req.json()
        : c.req.formData());

      // Parsing the value
      const data = validation.parse(raw);

      // Saving the record
      const response = await db
        .insert(collection.schema)
        .values(data)
        .returning({ insertedId: collection.queryKey });

      // Returning the response
      return c.json(response);
    },
  );

  // Bulk create records endpoint
  app.post(
    "/bulk",
    operationsMiddleware(collection, AccessType.BULK_CREATE),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.BULK_CREATE));

      // Generating the zod validation
      const validation = z.array(createInsertSchema(collection.schema));

      // Getting the raw data
      const raw = await (c.req.header("Content-Type") === "application/json"
        ? c.req.json()
        : c.req.formData());

      // Parsing the value
      const data = validation.parse(raw);

      // Saving the record
      const response = await db
        .insert(collection.schema)
        .values(data)
        .returning({ insertedId: collection.queryKey });

      // Returning the response
      return c.json(response);
    },
  );

  // Retrieve record endpoint
  app.get(
    "/:id",
    operationsMiddleware(collection, AccessType.RETRIEVE),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.RETRIEVE));

      // Getting the record
      const record = await db
        .select()
        .from(collection.schema)
        .where(eq(collection.queryKey, c.req.param("id")));

      // Returning the response
      return c.json(record);
    },
  );

  // Update record endpoint
  app.patch(
    "/:id",
    operationsMiddleware(collection, AccessType.UPDATE),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.UPDATE));

      // Generating the zod validation
      const validation = createInsertSchema(collection.schema).omit({
        [collection.queryKey.name]: true,
      } as any);

      // Getting the raw data
      const raw = await (c.req.header("Content-Type") === "application/json"
        ? c.req.json()
        : c.req.formData());

      // Parsing the value
      const data = validation.parse(raw);

      // Updating the record
      const response = await db
        .update(collection.schema)
        .set(data)
        .where(eq(collection.queryKey, c.req.param("id")))
        .returning({ updatedId: collection.queryKey });

      // Returning the response
      return c.json(response);
    },
  );

  // Delete record endpoint
  app.delete(
    "/:id",
    operationsMiddleware(collection, AccessType.DELETE),
    async (c) => {
      // Checking if the req has access
      await doWeHaveAccess(collection.access(c, AccessType.DELETE));

      // Deleting the record
      await db
        .delete(collection.schema)
        .where(eq(collection.queryKey, c.req.param("id")));

      // Returning the response
      return c.json(null);
    },
  );

  // Applying the plugins
  for (const plugin of collection.plugins) {
    app = plugin(app, collection);
  }

  return app;
}

export async function doWeHaveAccess(value: Promisify<boolean>) {
  // Getting the value
  const hasAccess = await value;

  // Throwing error if the req don't have access
  if (!hasAccess) throw new HTTPException(403, { message: "Access denied" });
}
