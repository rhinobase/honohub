import type { AnyDrizzleDB } from "drizzle-graphql";
import type { Column, Table } from "drizzle-orm";
import type { Context, Env, Hono, Schema } from "hono";
import type { BlankSchema, Input } from "hono/types";
import type { JSONValue } from "hono/utils/types";
import type { Prettify, Promisify } from "./utils";

export type TableColumns<T extends Table> = keyof T["_"]["columns"];

/** Manage all aspects of a data collection */
export type CollectionConfig<T extends Table = Table, U = TableColumns<T>> = {
  /**
   * The collection slug
   * @default tableName
   */
  slug?: string;
  /**
   * The key to use for querying
   * @default pk Tables primary key
   */
  queryKey?: Column<any, object, object>;
  schema: T;
  /**
   * Access control
   */
  access?: <
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(
    c: Context<E, P, I>,
  ) => Promisify<boolean>;
  /**
   * Default sort order
   */
  defaultSort?: U | `-${U & string}`;
  /**
   * Fields to be searched via the full text search
   */
  listSearchableFields?: U[];
  /**
   * Collection admin options
   */
  admin?: Partial<CollectionAdminProps<T, U>>;
  /**
   * Pagination options
   * @default false
   */
  pagination?: CollectionPagination | false;
  /**
   * Hooks to modify HonoHub functionality
   */
  hooks?: Partial<CollectionHooks<T>>;
  plugins?: CollectionPlugin<T>[];
};

/** Sanitized collection configuration */
export type SanitizedCollection<
  T extends Table = Table,
  U = TableColumns<T>,
> = Prettify<
  Required<Omit<CollectionConfig<T, U>, "defaultSort" | "admin">> & {
    defaultSort?: U | `-${U & string}`;
    admin: CollectionAdminProps<T, U> & { actions: CollectionAction<T, U>[] };
  }
>;

/** Collection pagination options */
export type CollectionPagination = {
  /**
   * Default limit for pagination
   * @default 10
   * @minimum 1
   * @maximum maxLimit
   */
  defaultLimit: number;
  /**
   * Maximum limit for pagination
   * @minimum 1
   */
  maxLimit?: number;
};

export type CollectionAdminProps<
  T extends Table = Table,
  U = TableColumns<T>,
> = {
  /**
   * Label configuration
   */
  label: string | { singular: string; plural: string };
  /**
   * Default columns to show in list view
   */
  columns?: (U | { name: U; label: string; type?: string })[];
  fields?: (
    | U
    | {
        name: U;
        label: string;
        type?: string;
        required?: boolean;
        description?: string;
      }
  )[];
  /**
   * Quick actions to perform on the collection from the UI
   * @default false
   */
  actions?: boolean | CollectionAction<T>[];
};

export type CollectionAction<T extends Table = Table, U = TableColumns<T>> = {
  name: string;
  label?: string;
  icon?: string;
  action: <
    Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(props: {
    db: Database;
    items: unknown[];
    context: Context<E, P, I>;
    config: SanitizedCollection<T, U>;
  }) => Promisify<void>;
  level?: boolean | { title: string; message: string };
};

export type CollectionPlugin<T extends Table = Table, U = TableColumns<T>> = {
  name: string;
  register?: (
    config: SanitizedCollection<T, U>,
  ) => SanitizedCollection<T, U> | undefined;
  bootstrap?: <
    E extends Env = Env,
    P extends Schema = BlankSchema,
    I extends string = string,
  >(props: {
    app: Hono<E, P, I>;
    config: SanitizedCollection<T, U>;
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
