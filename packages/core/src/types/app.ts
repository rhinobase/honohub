import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { SanitizedCollection } from "./collection";

export type AppConfig<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>> =
  Partial<SanitizedApp<Database>> & {
    db: Database;
  };

export type SanitizedApp<
  Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
> = {
  db: Database;
  collections: SanitizedCollection[];
  plugins: AppPluginFunction<Database>[];
};

export type AppPluginFunction<Database extends AnyDrizzleDB<any>> = <
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(
  app: Hono<E, P, I>,
  config: SanitizedApp<Database>,
) => Hono<E, P, I>;
