import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../shared/schema";

async function runMigrations() {
  console.log("Starting database migrations...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient, { schema });

  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations completed successfully!");

    // Import and run the seed script
    await import("./seed.js");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await migrationClient.end();
  }
}

// Run the migration function
runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration process failed:", error);
    process.exit(1);
  });