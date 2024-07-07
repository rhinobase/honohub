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
    const tmp = plugin.setup?.({ app: hub, config });
    if (tmp) hub = tmp;
  }

  // Returning the app
  return hub;
}
