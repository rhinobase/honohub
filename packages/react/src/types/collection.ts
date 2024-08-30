import type { CollectionAction, CollectionAdminProps } from "honohub";

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
  actions: Omit<CollectionAction, "action">[];
};
