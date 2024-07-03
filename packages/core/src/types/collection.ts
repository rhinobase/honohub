import type { Column, Table, TableConfig } from "drizzle-orm";
import type { Context, Env, Hono, Schema } from "hono";
import type { BlankSchema } from "hono/types";
import type { AccessType } from "../utils";
import type { CollectionHooks } from "./hook";
import type { Prettify, Promisify } from "./utils";

export type ExtendedTableConfig = TableConfig<Column<any, object, object>>;

export type CollectionConfig<
  T extends ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
> = Prettify<
  Partial<SanitizedCollection<T, E, P, I>> & {
    slug: string;
    schema: Table<T>;
  }
>;

type DTable<T extends ExtendedTableConfig> = Table<T>["_"]["columns"];

export type SanitizedCollection<
  T extends ExtendedTableConfig = ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
> = {
  slug: string;
  queryKey: DTable<T>[keyof DTable<T>];
  schema: Table<T>;
  access: (c: Context, access_type: AccessType) => Promisify<boolean>;
  defaultSort?:
    | keyof DTable<T>
    // @ts-ignore
    | `-${keyof DTable<T>}`;
  listSearchableFields: (keyof DTable<T>)[];
  pagination:
    | {
        defaultLimit?: number;
        maxLimit?: number;
      }
    | false;
  hooks: Partial<CollectionHooks>;
  plugins: CollectionPlugin<T, E, P, I>[];
};

export type CollectionPlugin<
  T extends ExtendedTableConfig = ExtendedTableConfig,
  E extends Env = Env,
  P extends Schema = BlankSchema,
  I extends string = string,
> = (
  app: Hono<E, P, I>,
  config: SanitizedCollection<T, E, P, I>,
) => Hono<E, P, I>;
