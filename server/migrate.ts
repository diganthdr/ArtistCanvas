import { runMigrations } from "./database";

// Run the migrations
async function runMigrationsScript() {
  try {
    await runMigrations();
    process.exit(0);
  } catch (error) {
    console.error("Migration script failed:", error);
    process.exit(1);
  }
}

runMigrationsScript();