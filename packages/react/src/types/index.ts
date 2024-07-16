import type { JSONObject } from "hono/utils/types";

export type CollectionType = {
  slug: string;
  label: string;
  columns: { name: string; label: string; type: string }[];
  fields: { name: string; label: string; type: string; required?: boolean }[];
};

export type PluginType = Record<
  string,
  {
    label: string;
    icon?: string;
    import: string | { module: string; component: string };
    props: JSONObject;
  }
>;

export type HonoHubProps = {
  basePath: string;
  serverUrl: string;
  plugins?: PluginType;
  collections: CollectionType[];
};
