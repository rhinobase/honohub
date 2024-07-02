import { type Env, Hono, type Schema } from "hono";
import type { BlankSchema } from "hono/types";
import { createRoutes } from "../routes";
import type { AppConfig, ExtendedTableConfig, SanitizedApp } from "../types";

export function defineApp<
  Database,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: AppConfig<Database, E, P, I>) {
  const { db, collections = [], plugins = [] } = config;

  const sanitizedConfig: SanitizedApp<Database, E, P, I> = {
    db,
    collections,
    plugins,
  };

  let app = new Hono<E, P, I>();

  // Adding routes
  for (let index = collections.length - 1; index >= 0; index--) {
    const collection = collections[index];
    // @ts-expect-error
    app.route(`/${collection.slug}`, createRoutes(sanitizedConfig, collection));
  }

  // Applying the plugins
  for (const plugin of plugins) {
    app = plugin(app, sanitizedConfig);
  }

  // Returning the app
  return app;
}
