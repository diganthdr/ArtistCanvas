import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function addPasswordResetFields() {
  try {
    console.log("Adding password reset fields to users table...");
    
    // Add email column
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
    `);
    
    // Add reset token column
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token TEXT;
    `);
    
    // Add reset token expiry column
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
    `);
    
    // For existing users, set email as username for now
    await db.execute(sql`
      UPDATE users
      SET email = username || '@diganth.com'
      WHERE email IS NULL;
    `);

    console.log("Password reset fields added successfully!");
  } catch (error) {
    console.error("Error adding password reset fields:", error);
    throw error;
  }
}

// Run the migration
addPasswordResetFields().catch(console.error);