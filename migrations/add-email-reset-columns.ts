import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

async function addEmailResetColumns() {
  const client = postgres({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  const db = drizzle(client);
  
  
  console.log('Adding email and reset columns to users table...');

  try {
    // Check if the columns already exist
    const columnsResult = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);

    if (columnsResult.length === 0) {
      // Add email column
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN email TEXT UNIQUE
      `);
      console.log('Added email column to users table');
    }

    // Check if reset_token column exists
    const resetTokenResult = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'reset_token'
    `);

    if (resetTokenResult.length === 0) {
      // Add reset_token column
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN reset_token TEXT
      `);
      console.log('Added reset_token column to users table');
    }

    // Check if reset_token_expiry column exists
    const resetTokenExpiryResult = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'reset_token_expiry'
    `);

    if (resetTokenExpiryResult.length === 0) {
      // Add reset_token_expiry column
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN reset_token_expiry TIMESTAMP
      `);
      console.log('Added reset_token_expiry column to users table');
    }

    // Update admin user to have an email
    await db.execute(sql`
      UPDATE users
      SET email = 'admin@diganth-art.com'
      WHERE username = 'admin' AND email IS NULL
    `);
    console.log('Updated admin user with email');

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Export as default for import in server/index.ts
export default addEmailResetColumns;

// For direct execution (when run with tsx/node)
// This is a simple check for ESM modules - more complex in a real app
if (import.meta.url.includes(process.argv[1])) {
  addEmailResetColumns().catch(console.error);
}