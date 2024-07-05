import { type Env, Hono, type Schema } from "hono";
import type { DashConfig, SanitizedDash } from "./types";

export function defineDash<E extends Env, P extends Schema, I extends string>(
  config: DashConfig,
) {
  const { serverURL, meta = {}, dateFormat, components } = config;

  const sanitizedConfig: SanitizedDash = {
    serverURL,
    meta,
    dateFormat,
    components,
  };

  const app = new Hono<E, P, I>();

  // Adding routes
  // for (let index = collections.length - 1; index >= 0; index--) {
  //   const collection = collections[index];

  //   app.route(`/${collection.slug}`, createRoutes(sanitizedConfig, collection));
  // }

  // Applying the plugins
  // for (const plugin of plugins) {
  //   app = plugin(app, sanitizedConfig);
  // }

  // Returning the app
  return app;
}
