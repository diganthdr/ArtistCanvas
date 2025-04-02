import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@shared/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// Initialize the postgres client
const client = postgres(process.env.DATABASE_URL!);

// Initialize the drizzle client with the schema
export const db = drizzle(client, { schema });

// A function to run migrations
export async function runMigrations() {
  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

// A function to connect to the database
export async function connectToDatabase() {
  console.log("Connecting to database...");
  try {
    // Test the connection
    await client`SELECT 1`;
    console.log("Database connection successful");
    return client;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}