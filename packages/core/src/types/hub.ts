import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { JSONObject } from "hono/utils/types";
import type { SanitizedCollection } from "./collection";
import type { Driver } from "./driver";
import type { Prettify } from "./utils";

export type HubConfig = {
  db: Driver;
  serverUrl?: string;
  collections?: SanitizedCollection[];
  routes?: RouteOptions[];
  plugins?: GlobalPlugin[];
};

export type SanitizedHub = Prettify<Required<HubConfig>>;

export type RouteOptions = {
  label: string;
  icon?: string;
  path: string;
  import: string | { module: string; component: string };
  props?: JSONObject | ((config: HubConfig) => JSONObject | undefined);
};

export type GlobalPlugin = {
  // Plugin name
  name: string;
  // Update the hub configuration
  register?: (config: SanitizedHub) => SanitizedHub | undefined;
  // Update the app instance
  bootstrap?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(
    props: GlobalPluginSetupProps<E, P, I>,
  ) => Hono<E, P, I> | undefined;
};

export type GlobalPluginSetupProps<
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
> = {
  app: Hono<E, P, I>;
  config: SanitizedHub;
};
