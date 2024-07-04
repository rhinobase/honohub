import type { AnyDrizzleDB } from "drizzle-graphql";
import { type Env, Hono, type Schema } from "hono";
import { createRoutes } from "./routes";
import type { AppConfig, SanitizedApp } from "./types";

export function defineApp<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: AppConfig<Database>) {
  const { db, collections = [], plugins = [] } = config;

  const sanitizedConfig: SanitizedApp<Database> = {
    db,
    collections,
    plugins,
  };

  let app = new Hono<E, P, I>();

  // Adding routes
  for (let index = collections.length - 1; index >= 0; index--) {
    const collection = collections[index];

    app.route(`/${collection.slug}`, createRoutes(sanitizedConfig, collection));
  }

  // Applying the plugins
  for (const plugin of plugins) {
    app = plugin(app, sanitizedConfig);
  }

  // Returning the app
  return app;
}
