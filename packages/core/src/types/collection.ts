import type { Context, Env, Hono, Schema } from "hono";
import type { BlankSchema, Input } from "hono/types";
import type { JSONValue } from "hono/utils/types";
import type { Driver } from "./driver";
import type { Prettify, Promisify } from "./utils";

/** Manage all aspects of a data collection */
export type CollectionConfig<T extends Record<string, unknown>, U = keyof T> = {
  /**
   * The collection slug
   */
  slug: string;
  /**
   * The key to use for querying
   * @default pk Tables primary key
   */
  queryKey?: U;
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
  plugins?: CollectionPlugin<T, U>[];
};

/** Sanitized collection configuration */
export type SanitizedCollection<
  T extends Record<string, unknown> = Record<string, unknown>,
  U = keyof T,
> = Prettify<
  Required<Omit<CollectionConfig<T, U>, "defaultSort" | "queryKey" | "admin">> &
    Pick<CollectionConfig<T, U>, "defaultSort" | "queryKey"> & {
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
  T extends Record<string, unknown> = Record<string, unknown>,
  U = keyof T,
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
  actions?: boolean | CollectionAction<T, U>[];
};

export type CollectionAction<
  T extends Record<string, unknown> = Record<string, unknown>,
  U = keyof T,
> = {
  name: string;
  label?: string;
  icon?: string;
  action: <
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(props: {
    db: Driver;
    items: unknown[];
    context: Context<E, P, I>;
    config: SanitizedCollection<T, U>;
  }) => Promisify<void>;
  level?: boolean | { title: string; message: string };
};

export type CollectionPlugin<
  T extends Record<string, unknown> = Record<string, unknown>,
  U = keyof T,
> = {
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

export type CollectionHooks<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
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

export type CollectionBeforeValidateHook<
  T extends Record<string, unknown> = Record<string, unknown>,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: JSONValue;
  originalDoc?: T;
}) => Promisify<JSONValue>;

export type CollectionBeforeChangeHook<
  T extends Record<string, unknown> = Record<string, unknown>,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: T;
  originalDoc?: T;
}) => Promisify<T>;

export type CollectionAfterChangeHook<
  T extends Record<string, unknown> = Record<string, unknown>,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T;
  previousDoc: T;
}) => Promisify<JSONValue | undefined>;

export type CollectionBeforeReadHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
}) => Promisify<void>;

export type CollectionAfterReadHook<
  T extends Record<string, unknown> = Record<string, unknown>,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T | { results: T[]; count: number } | T[];
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
export type CollectionAfterDeleteHook<
  T extends Record<string, unknown> = Record<string, unknown>,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: T;
}) => Promisify<JSONValue | undefined>;

export type CollectionAfterOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  result: unknown;
}) => Promisify<JSONValue>;
