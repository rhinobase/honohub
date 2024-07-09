import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedCollection } from "./collection";

export type HubConfig<Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>> =
  Partial<SanitizedHub<Database>> & {
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
  meta: Partial<RouteMetaOptions>;
  collections: SanitizedCollection<any>[];
  routes: Record<string, RouteOptions>;
  plugins: GlobalPlugin<Database>[];
};

export type BuildOptions = { cache: string; outDir: string };
export type RouteOptions = {
  import: string | { module: string; component: string };
  props?: <Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>>(
    config: HubConfig<Database>,
  ) => JSONObject | undefined;
  meta?: Partial<RouteMetaOptions>;
};
export type RouteMetaOptions = {
  title: string;
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
