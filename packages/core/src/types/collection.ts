import type { Column, Table } from "drizzle-orm";
import type { Context, Env, Hono, Schema } from "hono";
import type { BlankSchema, Input } from "hono/types";
import type { JSONValue } from "hono/utils/types";
import type { Prettify, Promisify } from "./utils";

export type CollectionConfig<T extends Table = Table> = Prettify<
  Partial<Omit<SanitizedCollection<T>, "admin">> & {
    slug: string;
    schema: T;
    admin?: Partial<CollectionAdminProps<T>>;
  }
>;

export type TableColumns<T extends Table> = keyof T["_"]["columns"];
export type SanitizedCollection<T extends Table = Table> = {
  slug: string;
  queryKey: Column<any, object, object>;
  schema: T;
  access: <
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(
    c: Context<E, P, I>,
  ) => Promisify<boolean>;
  defaultSort?: TableColumns<T> | `-${TableColumns<T> & string}`;
  listSearchableFields: TableColumns<T>[];
  admin: CollectionAdminProps<T>;
  pagination:
    | {
        defaultLimit: number;
        maxLimit?: number;
      }
    | false;
  hooks: Partial<CollectionHooks<T>>;
  plugins: CollectionPlugin<T>[];
};

export type CollectionAdminProps<T extends Table = Table> = {
  label: string | { singular: string; plural: string };
  columns?: (
    | TableColumns<T>
    | { name: TableColumns<T>; label: string; type?: string }
  )[];
  fields?: (
    | TableColumns<T>
    | {
        name: TableColumns<T>;
        label: string;
        type?: string;
        required?: boolean;
        description?: string;
      }
  )[];
  actions?: CollectionAction[];
};

export type CollectionAction = {
  name: string;
  label?: string;
  icon?: string;
  action: <
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(props: {
    items: unknown[];
    context: Context<E, P, I>;
  }) => Promisify<void>;
  level?: boolean | { title: string; message: string };
};

export type CollectionPlugin<T extends Table = Table> = {
  name: string;
  register?: (
    config: SanitizedCollection<T>,
  ) => SanitizedCollection<T> | undefined;
  bootstrap?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(props: {
    app: Hono<E, P, I>;
    config: SanitizedCollection<T>;
  }) => Hono<E, P, I> | undefined;
};

export type CollectionHooks<T extends Table = Table> = {
  beforeOperation: CollectionBeforeOperationHook[];
  beforeValidate: CollectionBeforeValidateHook<T>[];
  beforeChange: CollectionBeforeChangeHook<T>[];
  afterChange: CollectionAfterChangeHook<T>[];
  beforeRead: CollectionBeforeReadHook[];
  afterRead: CollectionAfterReadHook<T>[];
  beforeDelete: CollectionBeforeDeleteHook[];
  afterDelete: CollectionAfterDeleteHook<T>[];
  afterOperation: CollectionAfterOperationHook[];
};

export type CollectionBeforeOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
}) => Promisify<void>;

export type CollectionBeforeValidateHook<T extends Table = Table> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: JSONValue;
  originalDoc?: T["$inferInsert"];
}) => Promisify<JSONValue>;

export type CollectionBeforeChangeHook<T extends Table = Table> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: T["$inferInsert"];
  originalDoc?: T["$inferInsert"];
}) => Promisify<T["$inferInsert"]>;

export type CollectionAfterChangeHook<T extends Table = Table> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T["$inferInsert"];
  previousDoc: T["$inferInsert"];
}) => Promisify<JSONValue | undefined>;

export type CollectionBeforeReadHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
}) => Promisify<void>;

export type CollectionAfterReadHook<T extends Table = Table> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T["$inferInsert"] | { results: T["$inferInsert"][]; count: number };
}) => Promisify<JSONValue | undefined>;

export type CollectionBeforeDeleteHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
}) => Promisify<void>;

/**
 * Runs immediately after the delete operation removes
 * records from the database. Returned values are discarded.
 */
export type CollectionAfterDeleteHook<T extends Table = Table> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T["$inferInsert"];
}) => Promisify<JSONValue | undefined>;

export type CollectionAfterOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  result: unknown;
}) => Promisify<JSONValue>;
