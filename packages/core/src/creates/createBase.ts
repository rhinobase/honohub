import type { AnyDrizzleDB } from "drizzle-graphql";
import { type Env, Hono, type Schema } from "hono";
import type { SanitizedHub } from "../types";

export function createBase<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: SanitizedHub<Database>) {
  const { plugins } = config;

  let hub = new Hono<E, P, I>();

  // Applying the plugins
  for (const plugin of plugins) {
    try {
      const tmp = plugin.bootstrap?.({ app: hub, config });
      if (tmp) hub = tmp;
    } catch (e) {
      console.error(`Hub Plugin Bootstrap Error in ${plugin.name}`);
      console.error(e);
    }
  }

  // Returning the app
  return hub;
}
