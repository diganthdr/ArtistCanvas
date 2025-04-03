import postgres from "postgres";

/**
 * Migration to add site_settings table
 */
async function addSiteSettingsTable() {
  // Initialize the postgres client with SSL options
  const client = postgres(process.env.DATABASE_URL!, {
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check if the site_settings table already exists
    const tableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'site_settings'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('Creating site_settings table...');
      
      // Create the site_settings table
      await client`
        CREATE TABLE site_settings (
          id SERIAL PRIMARY KEY,
          setting_key TEXT NOT NULL UNIQUE,
          setting_value TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      console.log('Site settings table created successfully');
      
      // Insert default settings
      await client`
        INSERT INTO site_settings (setting_key, setting_value) VALUES
        ('contactEmail', 'contact@diganth.com'),
        ('contactPhone', '+1 (555) 123-4567'),
        ('contactAddress', '123 Art Studio Lane, Creative City, State 12345'),
        ('facebookUrl', 'https://facebook.com/diganthart'),
        ('instagramUrl', 'https://instagram.com/diganth_art'),
        ('twitterUrl', 'https://twitter.com/diganth_art');
      `;
      
      console.log('Default site settings added');
    } else {
      console.log('Site settings table already exists, skipping creation');
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    // Close the client connection
    await client.end();
  }
}

// Execute the migration
addSiteSettingsTable()
  .then(() => {
    console.log('Migration completed, exiting');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });