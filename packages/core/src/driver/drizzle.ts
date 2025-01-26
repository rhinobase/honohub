import type { AnyDrizzleDB } from "drizzle-graphql";
import {
  type Column,
  type InferModelFromColumns,
  type Table,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  getTableName,
  ilike,
  or,
} from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import type { ZodType } from "zod";
import type { CollectionConfig } from "../types";
import type { Driver, DriverCollection, ListQueryOptions } from "../types";

type TableColumns<T extends Table> = T["_"]["columns"];

export class DrizzleDriver implements Driver {
  constructor(private instance: AnyDrizzleDB<any>) {}

  collection<T, U>(config: CollectionConfig<T, U>) {
    // @ts-expect-error
    return new Collection(this.instance, config);
  }
}

class Collection<T extends Table, U = keyof TableColumns<T>>
  implements DriverCollection
{
  columns: TableColumns<T>;
  validation: {
    create: <T>(values: unknown) => Promise<T>;
    update: <T>(values: unknown) => Promise<T>;
  };

  constructor(
    private instance: AnyDrizzleDB<any>,
    private config: CollectionConfig<T, U>,
  ) {
    this.columns = getTableColumns(this.config.schema);

    // Validation
    const insertSchema = createInsertSchema(this.config.schema);
    const updateSchema = createUpdateSchema(this.config.schema);

    this.validation = {
      // @ts-expect-error
      create: (values) => insertSchema.parseAsync(values),
      // @ts-expect-error
      update: (values) => updateSchema.parseAsync(values),
    };
  }

  async list<R>(options?: Partial<ListQueryOptions>) {
    // Querying all the records
    // @ts-expect-error
    const records = this.instance.select().from(this.config.schema).$dynamic();

    if (options?.search && this.config.listSearchableFields?.length) {
      records.where(
        or(
          ...this.config.listSearchableFields.reduce((prev, field) => {
            if (String(field) in this.config.schema) {
              prev.push(
                // @ts-expect-error
                ilike(this.columns[String(field)], `%${options.search}%`),
              );
            }
            return prev;
          }, []),
        ),
      );
    }

    // Sorting the data
    const sortBy = options?.sortBy ?? this.config.defaultSort;
    let sortByInString = String(sortBy);

    let order: typeof desc;
    if (sortByInString.startsWith("-")) {
      sortByInString = sortByInString.slice(1);
      order = desc;
    } else {
      order = asc;
    }

    if (sortBy && sortByInString in this.config.schema) {
      records.orderBy(order(this.columns[sortByInString]));
    }

    if (this.config.pagination) {
      let limit = options?.limit;

      if (
        this.config.pagination.maxLimit &&
        options?.limit &&
        options.limit > this.config.pagination.maxLimit
      )
        limit = this.config.pagination.maxLimit;

      if (limit) records.limit(limit);
      if (options?.offset) records.offset(options.offset);

      // Counting the total records
      // TODO: update this to include serach filters
      const recordsCount = this.instance
        // @ts-expect-error
        .select({ count: count() })
        // @ts-expect-error
        .from(this.config.schema);

      const [results, totalRecords] = await Promise.all([
        records.execute(),
        // @ts-expect-error
        recordsCount.then((res) => {
          if ("count" in res[0]) return Number(res[0].count);

          throw new Error("Count not found in the response from the db.");
        }),
      ]);

      return { results, count: totalRecords } as {
        results: R[];
        count: number;
      };
    }

    return records.execute() as Promise<R[]>;
  }

  async count() {
    // TODO: add prepared query support
    return (
      this.instance
        // @ts-expect-error
        .select({ count: count() })
        // @ts-expect-error
        .from(this.config.schema)
        // @ts-expect-error
        .then((res) => {
          if ("count" in res[0]) return Number(res[0].count);

          throw new Error("Count not found in the response from the db.");
        })
    );
  }

  create<R>(values: R): Promise<R> {
    // Saving the record
    const query = this.instance
      // @ts-expect-error
      .insert(this.config.schema)
      .values(values)
      .$dynamic();

    if ("$returningId" in query && typeof query.$returningId === "function") {
      query.$returningId?.();
    } else {
      query.returning();
    }

    return query.execute();
  }

  retrieve<R>(id: string | number): Promise<R> {
    return (
      this.instance
        .select()
        // @ts-expect-error
        .from(this.config.schema)
        .where(eq(this.queryKey, id))
        // @ts-expect-error
        .then((records) => records[0])
    );
  }

  update<R>(id: string | number, values: R): Promise<R> {
    // Updating the record
    const query = this.instance
      // @ts-expect-error
      .update(this.config.schema)
      .set(values)
      .where(eq(this.queryKey, id))
      .$dynamic();

    if ("$returningId" in query && typeof query.$returningId === "function") {
      query.$returningId?.();
    } else {
      query.returning();
    }

    return query.execute();
  }

  delete<R>(id: string | number): Promise<R> {
    const query = this.instance
      // @ts-expect-error
      .delete(this.config.schema)
      .where(eq(this.queryKey, id))
      .$dynamic();

    if ("$returningId" in query && typeof query.$returningId === "function") {
      query.$returningId?.();
    } else {
      query.returning();
    }

    return query.execute();
  }

  get queryKey() {
    for (const [_, column] of Object.entries(this.columns) as [
      string,
      Column,
    ][]) {
      if (this.config.queryKey) {
        if (column.name === this.config.queryKey) return column;
      } else if (column.primary) return column;
    }

    throw new Error(
      `Unable to find primary key for ${getTableName(this.config.schema)} table!`,
    );
  }
}
