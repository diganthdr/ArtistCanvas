-- Initial schema creation
CREATE TABLE IF NOT EXISTS "artworks" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "medium" TEXT NOT NULL, 
  "image_url" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "size" TEXT NOT NULL,
  "year" TEXT NOT NULL,
  "is_featured" BOOLEAN DEFAULT false,
  "in_stock" BOOLEAN DEFAULT true,
  "is_framed" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS "workshops" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "image_url" TEXT NOT NULL,
  "spots_available" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "registrations" (
  "id" SERIAL PRIMARY KEY,
  "workshop_id" INTEGER NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "experience_level" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "subscribers" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "total" REAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL,
  "artwork_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" REAL NOT NULL
);

-- Add constraints
ALTER TABLE "registrations" ADD CONSTRAINT "fk_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "fk_artwork" FOREIGN KEY ("artwork_id") REFERENCES "artworks"("id") ON DELETE CASCADE;