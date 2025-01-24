import type { AnyDrizzleDB } from "drizzle-graphql";
import {
  type Column,
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
import type { CollectionConfig } from "../types";
import type { Driver, DriverCollection, ListQueryOptions } from "../types";

type TableColumns<T extends Table> = T["_"]["columns"];

export class DrizzleDriver<
  Database extends AnyDrizzleDB<any> = AnyDrizzleDB<any>,
> implements Driver
{
  constructor(private instance: Database) {}

  collection<T extends Table, U = TableColumns<T>>(
    config: CollectionConfig<T, U>,
  ) {
    return new Collection(this.instance, config);
  }
}

class Collection<
  Database extends AnyDrizzleDB<any>,
  T extends Database["_"]["fullSchema"][keyof Database["_"]["fullSchema"]],
  U = keyof TableColumns<T>,
> implements DriverCollection
{
  constructor(
    private instance: Database,
    private config: CollectionConfig<T, U>,
  ) {}

  async list<V extends T["$inferSelect"]>(options?: Partial<ListQueryOptions>) {
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
                ilike(this.config.schema[String(field)], `%${options.search}%`),
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
      records.orderBy(order(this.config.schema[sortByInString]));
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
        results: V[];
        count: number;
      };
    }

    return records.execute() as Promise<V[]>;
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

  create(values: T["$inferInsert"]) {
    // Saving the record
    const createdDocQuery = this.instance
      // @ts-expect-error
      .insert(this.config.schema)
      .values(values)
      .$dynamic();

    if (
      "$returningId" in createdDocQuery &&
      typeof createdDocQuery.$returningId === "function"
    ) {
      createdDocQuery.$returningId?.();
    } else {
      createdDocQuery.returning();
    }

    return createdDocQuery.execute() as Promise<T["$inferSelect"]>;
  }

  retrieve(id: string | number): Promise<T["$inferSelect"]> {
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

  update(id: string | number, values: T["$inferInsert"]) {
    // Updating the record
    const updatedDocQuery = this.instance
      // @ts-expect-error
      .update(this.config.schema)
      .set(values)
      .where(eq(this.queryKey, id))
      .$dynamic();

    if (
      "$returningId" in updatedDocQuery &&
      typeof updatedDocQuery.$returningId === "function"
    ) {
      updatedDocQuery.$returningId?.();
    } else {
      updatedDocQuery.returning();
    }

    return updatedDocQuery.execute() as Promise<T["$inferInsert"]>;
  }

  delete(id: string | number) {
    return (
      this.instance
        // @ts-expect-error
        .delete(this.config.schema)
        .where(eq(this.queryKey, id))
        .returning() as Promise<T["$inferSelect"]>
    );
  }

  get queryKey() {
    const columns = getTableColumns(this.config.schema);

    for (const [_, column] of Object.entries(columns) as [string, Column][]) {
      if (this.config.queryKey) {
        if (column.name === this.config.queryKey) return column;
      } else if (column.primary) return column;
    }

    throw new Error(
      `Unable to find primary key for ${getTableName(this.config.schema)} table!`,
    );
  }
}
