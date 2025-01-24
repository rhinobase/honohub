import type { Env, Schema } from "hono";
import { useRestAPI } from "../routes";
import type { SanitizedHub } from "../types";
import { createBase } from "./createBase";

export function createHub<E extends Env, P extends Schema, I extends string>(
  config: SanitizedHub,
) {
  return createBase<E, P, I>({
    ...config,
    plugins: [useRestAPI(), ...config.plugins],
  });
}
