import type { JSONObject } from "hono/utils/types";

export type PluginType = Record<
  string,
  {
    label: string;
    icon?: string;
    import: string | { module: string; component: string };
    props: JSONObject;
  }
>;
