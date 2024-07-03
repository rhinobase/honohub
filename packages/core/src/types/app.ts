import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { SanitizedCollection } from "./collection";

export type AppConfig<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
> = Partial<SanitizedApp<Database, E, P, I>> & {
  db: Database;
};

export type SanitizedApp<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
> = {
  db: Database;
  collections: SanitizedCollection[];
  plugins: AppPlugin<Database, E, P, I>[];
};

export type AppPlugin<
  Database extends AnyDrizzleDB<any>,
  E extends Env,
  P extends Schema,
  I extends string,
> = (
  app: Hono<E, P, I>,
  config: SanitizedApp<Database, E, P, I>,
) => Hono<E, P, I>;
