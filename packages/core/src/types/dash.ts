import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";

export type DashConfig = Partial<SanitizedDash> & {
  serverURL: string;
};

export type SanitizedDash = {
  serverURL: string;
  meta: {
    titleSuffix?: string;
    ogImage?: string;
    favicon?: string;
  };
  dateFormat?: string;
  components?: Record<string, unknown>;
  plugins: DashPluginFunction[];
};

export type DashPluginFunction = <
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(
  app: Hono<E, P, I>,
  config: SanitizedDash,
) => Hono<E, P, I>;
