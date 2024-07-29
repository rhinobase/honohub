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
        status: true,
        message: "Test the application",
      },
      {
        status: false,
        message: "Fix the bugs",
      },
      {
        status: true,
        message: "Implement new feature",
      },
      {
        status: false,
        message: "Refactor the code",
      },
      {
        status: true,
        message: "Optimize performance",
      },
      {
        status: false,
        message: "Write unit tests",
      },
      {
        status: true,
        message: "Deploy to production",
      },
      {
        status: false,
        message: "Create user interface",
      },
      {
        status: true,
        message: "Add authentication",
      },
      {
        status: false,
        message: "Improve error handling",
      },
      {
        status: true,
        message: "Document the code",
      },
      {
        status: false,
        message: "Fix security vulnerabilities",
      },
      {
        status: true,
        message: "Optimize database queries",
      },
      {
        status: false,
        message: "Implement caching",
      },
      {
        status: true,
        message: "Handle edge cases",
      },
      {
        status: false,
        message: "Improve user experience",
      },
      {
        status: true,
        message: "Add logging",
      },
      {
        status: false,
        message: "Refine user interface",
      },
      {
        status: true,
        message: "Implement error tracking",
      },
      {
        status: false,
        message: "Write integration tests",
      },
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
