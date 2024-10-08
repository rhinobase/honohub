import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedCollection } from "./collection";
import type { Prettify } from "./utils";

export type HubConfig<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>> =
  {
    db: Database;
    serverUrl?: string;
    collections?: SanitizedCollection<any>[];
    routes?: RouteOptions[];
    plugins?: GlobalPlugin<Database>[];
  };

export type SanitizedHub<
  Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
> = Prettify<Required<HubConfig<Database>>>;

export type RouteOptions = {
  label: string;
  icon?: string;
  path: string;
  import: string | { module: string; component: string };
  props?:
    | JSONObject
    | (<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>>(
        config: HubConfig<Database>,
      ) => JSONObject | undefined);
};

export type GlobalPlugin<Database extends AnyDrizzleDB<any>> = {
  // Plugin name
  name: string;
  // Update the hub configuration
  register?: (
    config: SanitizedHub<Database>,
  ) => SanitizedHub<Database> | undefined;
  // Update the app instance
  bootstrap?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(
    props: GlobalPluginSetupProps<Database, E, P, I>,
  ) => Hono<E, P, I> | undefined;
};

export type GlobalPluginSetupProps<
  Database extends AnyDrizzleDB<any>,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
> = {
  app: Hono<E, P, I>;
  config: SanitizedHub<Database>;
};
