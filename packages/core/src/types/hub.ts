import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { SanitizedAdmin } from "./admin";
import type { SanitizedCollection } from "./collection";

export type HubConfig<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>> =
  Partial<SanitizedHub<Database>> & {
    db: Database;
  };

export type SanitizedHub<
  Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
> = {
  db: Database;
  collections: SanitizedCollection[];
  admin?: SanitizedAdmin;
  plugins: GlobalPlugin<Database>[];
};

export type GlobalPlugin<Database extends AnyDrizzleDB<any>> = {
  name: string;
  config?: (
    config: SanitizedHub<Database>,
  ) => SanitizedHub<Database> | undefined;
  setup?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(props: {
    app: Hono<E, P, I>;
    config: SanitizedHub<Database>;
  }) => Hono<E, P, I> | undefined;
};
