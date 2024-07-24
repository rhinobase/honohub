import type { AnyDrizzleDB } from "drizzle-graphql";
import { type Env, Hono, type Schema } from "hono";
import type { SanitizedHub } from "../types";

/**
 * Creates the base HonoHub app
 *
 * @param config - The configuration object
 * @returns The Hono instance
 */
export function createBase<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: SanitizedHub<Database>) {
  const { plugins } = config;

  let app = new Hono<E, P, I>();

  // Applying the plugins
  for (const plugin of plugins) {
    try {
      const tmp = plugin.bootstrap?.({ app, config });
      if (tmp) app = tmp;
    } catch (e) {
      console.error(`[${plugin.name}] Hub Plugin Bootstrap Error`, e);
    }
  }

  // Returning the app
  return app;
}
