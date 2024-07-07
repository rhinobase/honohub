import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Schema } from "hono";
import { useRestAPI } from "../routes";
import type { SanitizedHub } from "../types";
import { createBase } from "./createBase";

export function createHub<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
>(config: SanitizedHub<Database>) {
  return createBase<Database, E, P, I>({
    ...config,
    plugins: [useRestAPI(), ...config.plugins],
  });
}
