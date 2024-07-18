import type { JSONObject } from "hono/utils/types";
import type { CollectionAdminProps } from "honohub";

type GetObject<T> = T extends string ? never : T;

export type CollectionType = {
  slug: string;
  label: CollectionAdminProps["label"];
  columns: GetObject<
    NonNullable<CollectionAdminProps["columns"]>[0] & { type: string }
  >[];
  fields: GetObject<
    NonNullable<CollectionAdminProps["fields"]>[0] & { type: string }
  >[];
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
