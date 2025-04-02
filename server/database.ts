import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import * as schema from '@shared/schema';

// Create the connection
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// Function to run migrations programmatically
export async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create the artworks table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        medium TEXT NOT NULL,
        image_url TEXT NOT NULL,
        price INTEGER NOT NULL,
        size TEXT NOT NULL,
        year TEXT NOT NULL,
        is_featured BOOLEAN,
        in_stock BOOLEAN,
        is_framed BOOLEAN
      );
    `);
    
    // Create the workshops table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS workshops (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration TEXT NOT NULL,
        location TEXT NOT NULL, 
        price INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        image_url TEXT NOT NULL
      );
    `);
    
    // Create the registrations table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        workshop_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (workshop_id) REFERENCES workshops(id)
      );
    `);
    
    // Create the contacts table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create the subscribers table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create the orders table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create the order_items table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        artwork_id INTEGER NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (artwork_id) REFERENCES artworks(id)
      );
    `);
    
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating database tables:', error);
    throw error;
  }
}

// Function to connect to the database and initialize it
export async function connectToDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Test the connection
    const result = await db.execute(sql`SELECT 1 + 1 AS result`);
    console.log('✅ Connected to database successfully');
    
    // Run migrations
    await runMigrations();
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}