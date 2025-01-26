import { zValidator } from "@hono/zod-validator";
import { type Env, Hono, type Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import type { BlankSchema } from "hono/types";
import { z } from "zod";
import type { SanitizedCollection, SanitizedHub } from "../types";

export function createRoutes<
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(config: SanitizedHub, collection: SanitizedCollection) {
  // Creating a new app
  let app = new Hono<E, P, I>().use(async (c, next) => {
    // Checking if we have access
    const hasAccess = await collection.access(c);

    // Throwing error if the req don't have access
    if (!hasAccess) throw new HTTPException(403, { message: "Access denied" });

    await next();
  });

  const instance = config.db.collection(collection);

  const defaultLimit =
    (typeof collection.pagination !== "boolean"
      ? collection.pagination?.defaultLimit
      : undefined) ?? 10;

  const queryValidationSchema = z.object({
    limit: z.coerce.number().nonnegative().default(defaultLimit),
    offset: z.coerce.number().nonnegative().default(0),
    search: z.string().optional(),
    sortBy: z.string().optional(),
  });

  // List records endpoint
  app.get("/", zValidator("query", queryValidationSchema), async (c) => {
    for (const hook of collection.hooks.beforeRead ?? []) {
      await hook({
        context: c,
      });
    }

    const query = c.req.valid("query");

    let payload = await instance.list(query);

    for (const hook of collection.hooks.afterRead ?? []) {
      const res = await hook({
        context: c,
        doc: payload,
      });

      // @ts-ignore
      if (res !== undefined) payload = res;
    }

    return c.json(payload);
  });

  // List records endpoint
  app.get("/count", async (c) =>
    c.json({
      count: await instance.count(),
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
    let data = await instance.validation.create(raw);

    for (const hook of collection.hooks.beforeChange ?? []) {
      const res = await hook({
        context: c,
        data,
      });

      if (res !== undefined) data = res;
    }

    // Saving the record
    let createdDoc = await instance.create(data);

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
    // TODO: Add id validation
    let record = await instance.retrieve(c.req.param("id") ?? "");

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
  app.put("/:id", async (c) => {
    // Getting the raw data
    let raw = await (c.req.header("Content-Type") === "application/json"
      ? c.req.json()
      : c.req.formData());

    if (!raw)
      throw new HTTPException(404, {
        message: "Request body is missing or empty",
      });

    // Getting the original document
    const record = await instance.retrieve(c.req.param("id") ?? "");

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
    let data = await instance.validation.update(raw);

    for (const hook of collection.hooks.beforeChange ?? []) {
      const res = await hook({
        context: c,
        data,
        originalDoc: record,
      });

      if (res !== undefined) data = res;
    }

    // Updating the record
    let updatedDoc: any = await instance.update(c.req.param("id") ?? "", data);

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
    let deletedDoc: any = await instance.delete(c.req.param("id") ?? "");

    for (const hook of collection.hooks.afterDelete ?? []) {
      const res = await hook({ context: c, doc: deletedDoc });
      if (res !== undefined) deletedDoc = res;
    }

    // Returning the response
    // @ts-ignore
    return c.json(deletedDoc);
  });

  // Actions
  if (collection.admin.actions.length > 0) {
    const actionRouter = new Hono<E, P, I>();

    for (const { name, action } of collection.admin.actions ?? []) {
      actionRouter.post(
        `/${name}`,
        zValidator(
          "json",
          z.object({
            items: z.array(z.any()).min(1).max(100),
          }),
        ),
        async (c) => {
          const { items } = c.req.valid("json");

          try {
            await action({ items, context: c, db, config: collection });
          } catch (err) {
            console.error(err);
            throw new HTTPException(400, {
              message: "Unable to complete the action!",
            });
          }

          return c.json(null);
        },
      );
    }

    app.route("/actions", actionRouter);
  }

  // Applying the plugins
  for (const plugin of collection.plugins) {
    try {
      const tmp = plugin.bootstrap?.({ app, config: collection });
      if (tmp) app = tmp;
    } catch (e) {
      console.error(`[${plugin.name}] Collection Plugin Bootstrap Error`, e);
    }
  }

  return app;
}
