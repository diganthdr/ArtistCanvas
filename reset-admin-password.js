/**
 * Reset Admin Password Script
 * This script resets the admin user's password
 */
import { db } from './server/db.js';
import { users } from './shared/schema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function resetAdminPassword() {
  try {
    console.log('Resetting admin password...');
    
    // New password hash using bcrypt
    const newPassword = 'admin@420';
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    // Update the admin user (assuming admin username is 'admin')
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.username, 'admin'))
      .returning();
    
    if (result.length > 0) {
      console.log('Admin password reset successfully!');
      console.log('Username: admin');
      console.log(`Password: ${newPassword}`);
    } else {
      console.log('Admin user not found. Please check the username.');
    }
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    process.exit(0);
  }
}

resetAdminPassword();