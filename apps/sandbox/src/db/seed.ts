import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { todos } from "./schema";

const sql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all data
    await db.delete(todos);

    await db.insert(todos).values([
      {
        id: 1,
        status: true,
        message: "Complete the API",
      },
      {
        id: 2,
        status: false,
        message: "Build the example",
      },
      {
        id: 3,
        status: false,
        message: "Write the docs",
      },
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
