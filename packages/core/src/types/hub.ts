import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedCollection } from "./collection";

export type HubConfig<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>> =
  Partial<Omit<SanitizedHub<Database>, "build">> & {
    db: Database;
    serverUrl: string;
    build?: Partial<BuildOptions>;
  };

export type SanitizedHub<
  Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
> = {
  db: Database;
  serverUrl: string;
  build: BuildOptions;
  collections: SanitizedCollection<any>[];
  routes: RouteOptions[];
  plugins: GlobalPlugin<Database>[];
};

export type BuildOptions = { cache: string; outDir: string };
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
  name: string;
  register?: (
    config: SanitizedHub<Database>,
  ) => SanitizedHub<Database> | undefined;
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
