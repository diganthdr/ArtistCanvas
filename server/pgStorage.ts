import { IStorage } from "./storage";
import { 
  users, artworks, workshops, registrations, contacts, subscribers, orders, orderItems,
  type User, type Artwork, type Workshop, type Registration, type Contact, type Subscriber, type Order, type OrderItem,
  type InsertUser, type InsertArtwork, type InsertWorkshop, type InsertRegistration, type InsertContact, type InsertSubscriber, type InsertOrder, type InsertOrderItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from 'pg';
const { Pool } = pg;

const PostgresSessionStore = connectPg(session);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export class PgStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db.select().from(users)
      .where(eq(users.resetToken, token));
    
    // Check if token has expired
    if (user && user.resetTokenExpiry && user.resetTokenExpiry > now) {
      return user;
    }
    
    return undefined;
  }

  async setResetToken(email: string, token: string, expiry: Date): Promise<boolean> {
    const result = await db.update(users)
      .set({ resetToken: token, resetTokenExpiry: expiry })
      .where(eq(users.email, email))
      .returning({ id: users.id });
    
    return result.length > 0;
  }

  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    const result = await db.update(users)
      .set({ 
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id });
    
    return result.length > 0;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks);
  }

  async getArtworkById(id: number): Promise<Artwork | undefined> {
    const [artwork] = await db.select().from(artworks).where(eq(artworks.id, id));
    return artwork;
  }

  async getArtworksByMedium(medium: string): Promise<Artwork[]> {
    return await db.select().from(artworks).where(eq(artworks.medium, medium));
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return await db.select().from(artworks).where(eq(artworks.isFeatured, true));
  }

  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const [newArtwork] = await db.insert(artworks).values(artwork).returning();
    return newArtwork;
  }

  async updateArtwork(id: number, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const [updatedArtwork] = await db.update(artworks)
      .set(artwork)
      .where(eq(artworks.id, id))
      .returning();
    return updatedArtwork;
  }

  async deleteArtwork(id: number): Promise<boolean> {
    await db.delete(artworks).where(eq(artworks.id, id));
    return true;
  }

  async getAllWorkshops(): Promise<Workshop[]> {
    return await db.select().from(workshops);
  }

  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, id));
    return workshop;
  }

  async getWorkshopsByType(type: string): Promise<Workshop[]> {
    return await db.select().from(workshops).where(eq(workshops.type, type));
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const [newWorkshop] = await db.insert(workshops).values(workshop).returning();
    return newWorkshop;
  }

  async updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const [updatedWorkshop] = await db.update(workshops)
      .set(workshop)
      .where(eq(workshops.id, id))
      .returning();
    return updatedWorkshop;
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    await db.delete(workshops).where(eq(workshops.id, id));
    return true;
  }
  
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db.insert(registrations).values(registration).returning();
    return newRegistration;
  }
  
  async getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.workshopId, workshopId));
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }
  
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values(subscriber).returning();
    return newSubscriber;
  }
  
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Start a transaction to ensure both the order and items are created or neither is
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    // Insert each order item with the new order ID
    const orderItemsWithId = items.map(item => ({
      ...item,
      orderId: newOrder.id
    }));
    
    await db.insert(orderItems).values(orderItemsWithId);
    
    return newOrder;
  }
  
  async getOrderById(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    
    if (!order) {
      return undefined;
    }
    
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    
    return { order, items };
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    return updatedOrder;
  }
}