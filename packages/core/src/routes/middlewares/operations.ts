import type { Env, Schema } from "hono";
import { createMiddleware } from "hono/factory";
import type { BlankSchema } from "hono/types";
import type { ExtendedTableConfig, SanitizedCollection } from "../../types";
import type { AccessType } from "../../utils";

export const operationsMiddleware = <
  T extends ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(
  collection: SanitizedCollection<T, E, P, I>,
  access_type: AccessType,
) =>
  createMiddleware(async (context, next) => {
    for (const hook of collection.hooks.beforeOperation ?? []) {
      hook({ context, access_type });
    }

    await next();

    for (const hook of collection.hooks.afterOperation ?? []) {
      hook({ context, access_type });
    }
  });
