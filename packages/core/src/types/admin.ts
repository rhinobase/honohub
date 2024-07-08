import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { JSONObject } from "hono/utils/types";
import type { HubConfig } from "./hub";

export type AdminConfig = Partial<SanitizedAdmin> & {
  serverURL: string;
  build?: Partial<BuildOptions>;
};

export type SanitizedAdmin = {
  serverURL: string;
  build: BuildOptions;
  meta: {
    title?: string;
    ogImage?: string;
    favicon?: string;
  };
  dateFormat?: string;
  routes: Record<string, RouteOptions>;
  plugins: AdminPlugin[];
};

export type BuildOptions = { cache: string; outDir: string };
export type RouteOptions = {
  import: string | { module: string; component: string };
  props?: (config: HubConfig) => JSONObject;
  seo?: {
    title?: string;
  };
};

export type AdminPlugin = {
  name: string;
  config?: (config: SanitizedAdmin) => SanitizedAdmin | undefined;
  setup?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(props: {
    app: Hono<E, P, I>;
    config: SanitizedAdmin;
  }) => Hono<E, P, I> | undefined;
};
