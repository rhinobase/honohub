import { type Env, Hono, type Schema } from "hono";
import type { SanitizedHub } from "../types";

export function createAdmin<E extends Env, P extends Schema, I extends string>(
  config: SanitizedHub,
) {
  const { admin } = config;

  if (!admin)
    throw new Error(
      "Config Error: The 'admin' property is not initialized in the config. Please ensure the 'admin' property is set correctly in your config.",
    );

  let hub = new Hono<E, P, I>();

  // Applying the plugins
  for (const plugin of admin.plugins) {
    const tmp = plugin.setup?.({ app: hub, config: admin });
    if (tmp) hub = tmp;
  }

  // Returning the app
  return hub;
}
