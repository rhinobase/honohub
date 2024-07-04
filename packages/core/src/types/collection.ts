import type { Column, Table as DzTable, TableConfig } from "drizzle-orm";
import type { Context, Env, Hono, Schema } from "hono";
import type { BlankSchema, Input } from "hono/types";
import type { JSONValue } from "hono/utils/types";
import type { Prettify, Promisify } from "./utils";

export type ExtendedTableConfig = TableConfig<Column<any, object, object>>;

export type CollectionConfig<
  Table extends ExtendedTableConfig = ExtendedTableConfig,
> = Prettify<
  Partial<SanitizedCollection<Table>> & {
    slug: string;
    schema: DzTable<Table>;
  }
>;

type TableColumns<T extends ExtendedTableConfig> = DzTable<T>["_"]["columns"];

export type SanitizedCollection<
  Table extends ExtendedTableConfig = ExtendedTableConfig,
> = {
  slug: string;
  queryKey: TableColumns<Table>[keyof TableColumns<Table>];
  schema: DzTable<Table>;
  access: <
    E extends Env = Env,
    P extends string = string,
    I extends Input = Input,
  >(
    c: Context<E, P, I>,
  ) => Promisify<boolean>;
  defaultSort?:
    | keyof TableColumns<Table>
    | `-${keyof TableColumns<Table> & string}`;
  listSearchableFields: (keyof TableColumns<Table>)[];
  pagination:
    | {
        defaultLimit: number;
        maxLimit?: number;
      }
    | false;
  hooks: Partial<CollectionHooks<Table>>;
  plugins: CollectionPluginFunction<Table>[];
};

export type CollectionPluginFunction<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
>(
  app: Hono<E, P, I>,
  config: SanitizedCollection<T>,
) => Hono<E, P, I>;

export type CollectionHooks<
  T extends ExtendedTableConfig = ExtendedTableConfig,
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
>(props: { context: Context<E, P, I> }) => void;

export type CollectionBeforeValidateHook<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: JSONValue;
  originalDoc?: DzTable<T>["$inferInsert"];
}) => JSONValue;

export type CollectionBeforeChangeHook<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  data: DzTable<T>["$inferInsert"];
  originalDoc?: DzTable<T>["$inferInsert"];
}) => DzTable<T>["$inferInsert"];

export type CollectionAfterChangeHook<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: DzTable<T>["$inferInsert"];
  previousDoc: DzTable<T>["$inferInsert"];
}) => void;

export type CollectionBeforeReadHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: { context: Context<E, P, I> }) => void;

export type CollectionAfterReadHook<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: DzTable<T>["$inferInsert"];
}) => Partial<DzTable<T>["$inferInsert"]>;

export type CollectionBeforeDeleteHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: { context: Context<E, P, I> }) => void;

/**
 * Runs immediately after the delete operation removes
 * records from the database. Returned values are discarded.
 */
export type CollectionAfterDeleteHook<
  T extends ExtendedTableConfig = ExtendedTableConfig,
> = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  doc: DzTable<T>["$inferInsert"];
}) => void;

export type CollectionAfterOperationHook = <
  E extends Env = Env,
  P extends string = string,
  I extends Input = Input,
>(props: {
  context: Context<E, P, I>;
  result: unknown;
}) => JSONValue;
