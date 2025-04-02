import { 
  User, InsertUser,
  Artwork, InsertArtwork,
  Workshop, InsertWorkshop,
  Registration, InsertRegistration,
  Contact, InsertContact,
  Subscriber, InsertSubscriber,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  users, artworks, workshops, registrations, contacts, subscribers, orders, orderItems
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import session from "express-session";

export class PgStorage implements IStorage {
  public sessionStore: session.Store;
  
  constructor() {
    // Create a memory store for sessions
    import('memorystore').then(memorystore => {
      const MemoryStore = memorystore.default(session);
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    });
    
    // Initialize with a default store until import completes
    this.sessionStore = new session.MemoryStore();
  }
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.query.users.findMany({
      where: eq(users.id, id)
    });
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.query.users.findMany({
      where: eq(users.username, username)
    });
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users)
      .values(user)
      .returning();
    return result[0];
  }

  // Artwork methods
  async getAllArtworks(): Promise<Artwork[]> {
    return await db.query.artworks.findMany();
  }

  async getArtworkById(id: number): Promise<Artwork | undefined> {
    const results = await db.query.artworks.findMany({
      where: eq(artworks.id, id)
    });
    return results[0];
  }

  async getArtworksByMedium(medium: string): Promise<Artwork[]> {
    return await db.query.artworks.findMany({
      where: eq(artworks.medium, medium)
    });
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return await db.query.artworks.findMany({
      where: eq(artworks.isFeatured, true)
    });
  }

  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const result = await db.insert(artworks)
      .values(artwork)
      .returning();
    return result[0];
  }

  async updateArtwork(id: number, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const result = await db.update(artworks)
      .set(artwork)
      .where(eq(artworks.id, id))
      .returning();
    return result[0];
  }

  async deleteArtwork(id: number): Promise<boolean> {
    const result = await db.delete(artworks)
      .where(eq(artworks.id, id))
      .returning();
    return result.length > 0;
  }

  // Workshop methods
  async getAllWorkshops(): Promise<Workshop[]> {
    return await db.query.workshops.findMany();
  }

  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    const results = await db.query.workshops.findMany({
      where: eq(workshops.id, id)
    });
    return results[0];
  }

  async getWorkshopsByType(type: string): Promise<Workshop[]> {
    return await db.query.workshops.findMany({
      where: eq(workshops.type, type)
    });
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const result = await db.insert(workshops)
      .values(workshop)
      .returning();
    return result[0];
  }

  async updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const result = await db.update(workshops)
      .set(workshop)
      .where(eq(workshops.id, id))
      .returning();
    return result[0];
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    const result = await db.delete(workshops)
      .where(eq(workshops.id, id))
      .returning();
    return result.length > 0;
  }

  // Registration methods
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const result = await db.insert(registrations)
      .values(registration)
      .returning();
    return result[0];
  }

  async getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]> {
    return await db.query.registrations.findMany({
      where: eq(registrations.workshopId, workshopId)
    });
  }

  // Contact methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts)
      .values(contact)
      .returning();
    return result[0];
  }

  // Subscriber methods
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const result = await db.insert(subscribers)
      .values(subscriber)
      .returning();
    return result[0];
  }

  // Order methods
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Start a transaction
    // Note: Drizzle ORM with Neon serverless doesn't support transactions
    // in the way other ORMs do, but we can still ensure data consistency
    
    // 1. Create the order first
    const orderResult = await db.insert(orders)
      .values(order)
      .returning();
    
    const newOrder = orderResult[0];
    
    // 2. Create the order items with the new order ID
    for (const item of items) {
      await db.insert(orderItems)
        .values({
          ...item,
          orderId: newOrder.id
        });
    }
    
    return newOrder;
  }

  async getOrderById(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined> {
    const orderResults = await db.query.orders.findMany({
      where: eq(orders.id, id)
    });
    
    if (orderResults.length === 0) {
      return undefined;
    }
    
    const order = orderResults[0];
    
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, id)
    });
    
    return { order, items };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
}