import { db } from "../server/db.js";
import { users, artworks, workshops } from "../shared/schema.js";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util"; 
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // Check if the admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      
      // Create admin user
      await db.insert(users).values({
        username: "admin",
        email: "admin@diganth.com",
        password: await hashPassword("DiguArt@420"),
        isAdmin: true,
        createdAt: new Date()
      });
    } else {
      console.log("Admin user already exists.");
    }
    
    // Check if there are any artworks
    const existingArtworks = await db.select().from(artworks).limit(1);
    
    if (existingArtworks.length === 0) {
      console.log("Creating sample artworks...");
      
      // Sample artworks
      const sampleArtworks = [
        {
          title: "Sunset Mountains",
          description: "A breathtaking depiction of mountains at sunset, capturing the warm golden light casting long shadows across the peaks.",
          medium: "oil",
          imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
          price: 750,
          size: "24\" x 36\"",
          year: "2023",
          isFeatured: true,
          inStock: true,
          isFramed: true
        },
        {
          title: "Fluid Dreams",
          description: "Abstract acrylic painting exploring the fluidity of dreams through vibrant colors and flowing forms.",
          medium: "acrylic",
          imageUrl: "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5",
          price: 580,
          size: "30\" x 40\"",
          year: "2023",
          isFeatured: true,
          inStock: true,
          isFramed: false
        },
        {
          title: "Serene Valley",
          description: "A serene watercolor landscape capturing the misty morning atmosphere of a peaceful valley.",
          medium: "watercolor",
          imageUrl: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7",
          price: 420,
          size: "18\" x 24\"",
          year: "2022",
          isFeatured: true,
          inStock: true,
          isFramed: true
        },
        {
          title: "Ocean Waves",
          description: "A mesmerizing oil painting capturing the motion and power of ocean waves as they crash against the shore at sunset.",
          medium: "oil",
          imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
          price: 680,
          size: "24\" x 36\"",
          year: "2023",
          isFeatured: false,
          inStock: true,
          isFramed: true
        },
        {
          title: "Color Explosion",
          description: "A vibrant explosion of colors in abstract form, representing the chaotic beauty of creative energy.",
          medium: "acrylic",
          imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5",
          price: 520,
          size: "30\" x 30\"",
          year: "2022",
          isFeatured: false,
          inStock: true,
          isFramed: false
        }
      ];
      
      for (const artwork of sampleArtworks) {
        await db.insert(artworks).values(artwork);
      }
    } else {
      console.log("Artworks already exist.");
    }
    
    // Check if there are any workshops
    const existingWorkshops = await db.select().from(workshops).limit(1);
    
    if (existingWorkshops.length === 0) {
      console.log("Creating sample workshops...");
      
      // Sample workshops
      const sampleWorkshops = [
        {
          title: "Oil Painting Fundamentals",
          description: "Learn the basics of oil painting including color mixing, layering techniques, and composition. All materials provided.",
          price: 120,
          date: "June 15, 2023",
          time: "10:00 AM - 2:00 PM",
          location: "Art Studio, 123 Creative Ave, City",
          type: "in-person",
          imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
          spotsAvailable: 5
        },
        {
          title: "Watercolor Landscapes",
          description: "Explore watercolor techniques to create stunning landscape paintings. Materials list provided upon registration.",
          price: 80,
          date: "June 22, 2023",
          time: "6:00 PM - 8:00 PM",
          location: "Zoom Session (Link sent after registration)",
          type: "online",
          imageUrl: "https://images.unsplash.com/photo-1587385789097-0197a7fbd179",
          spotsAvailable: 12
        },
        {
          title: "Abstract Acrylic Painting",
          description: "Let your creativity flow with this abstract acrylic painting workshop. Perfect for all skill levels.",
          price: 95,
          date: "July 5, 2023",
          time: "1:00 PM - 4:00 PM",
          location: "Community Arts Center, 456 Gallery Road",
          type: "in-person",
          imageUrl: "https://images.unsplash.com/photo-1510832842230-87253f48d74f",
          spotsAvailable: 8
        }
      ];
      
      for (const workshop of sampleWorkshops) {
        await db.insert(workshops).values(workshop);
      }
    } else {
      console.log("Workshops already exist.");
    }
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Simply export the seeding function as default
export default seedDatabase;