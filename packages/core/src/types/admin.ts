import type { Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";

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
  routes: Record<
    string,
    {
      import: string | { module: string; component: string };
      seo?: {
        title?: string;
      };
    }
  >;
  plugins: AdminPlugin[];
};

export type BuildOptions = { cache: string; outDir: string };

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
