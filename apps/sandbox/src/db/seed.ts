import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { todos } from "./schema";

const sql = neon(process.env.DATABASE_URL ?? "");

const db = drizzle(sql, { schema });

const messages = [
  "Test the application",
  "Fix the bugs",
  "Implement new feature",
  "Refactor the code",
  "Optimize performance",
  "Write unit tests",
  "Deploy to production",
  "Create user interface",
  "Add authentication",
  "Improve error handling",
  "Document the code",
  "Fix security vulnerabilities",
  "Optimize database queries",
  "Implement caching",
  "Handle edge cases",
  "Improve user experience",
  "Add logging",
  "Refine user interface",
  "Implement error tracking",
  "Write integration tests",
];

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all data
    await db.delete(todos);

    await db.insert(todos).values(
      messages.map((message, index) => ({
        message,
        status: Boolean(index % 2),
      })),
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
