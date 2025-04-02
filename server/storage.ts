import { 
  users, User, InsertUser,
  artworks, Artwork, InsertArtwork,
  workshops, Workshop, InsertWorkshop,
  registrations, Registration, InsertRegistration,
  contacts, Contact, InsertContact,
  subscribers, Subscriber, InsertSubscriber,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artwork methods
  getAllArtworks(): Promise<Artwork[]>;
  getArtworkById(id: number): Promise<Artwork | undefined>;
  getArtworksByMedium(medium: string): Promise<Artwork[]>;
  getFeaturedArtworks(): Promise<Artwork[]>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;
  updateArtwork(id: number, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined>;
  deleteArtwork(id: number): Promise<boolean>;

  // Workshop methods
  getAllWorkshops(): Promise<Workshop[]>;
  getWorkshopById(id: number): Promise<Workshop | undefined>;
  getWorkshopsByType(type: string): Promise<Workshop[]>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined>;
  deleteWorkshop(id: number): Promise<boolean>;
  
  // Registration methods
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Subscriber methods
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Order methods
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrderById(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artworks: Map<number, Artwork>;
  private workshops: Map<number, Workshop>;
  private registrations: Map<number, Registration>;
  private contacts: Map<number, Contact>;
  private subscribers: Map<number, Subscriber>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  public sessionStore: session.Store;
  private currentIds: {
    user: number;
    artwork: number;
    workshop: number;
    registration: number;
    contact: number;
    subscriber: number;
    order: number;
    orderItem: number;
  };

  constructor() {
    this.users = new Map();
    this.artworks = new Map();
    this.workshops = new Map();
    this.registrations = new Map();
    this.contacts = new Map();
    this.subscribers = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    // Initialize with a default memory store
    this.sessionStore = new session.MemoryStore();
    
    this.currentIds = {
      user: 1,
      artwork: 1,
      workshop: 1,
      registration: 1,
      contact: 1,
      subscriber: 1,
      order: 1,
      orderItem: 1,
    };

    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const now = new Date();
    const newUser: User = {
      id,
      username: user.username,
      password: user.password,
      isAdmin: user.isAdmin ?? true,
      createdAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  private initializeSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "DiguArt@420",
      isAdmin: true
    });

    // Sample artworks
    const sampleArtworks: InsertArtwork[] = [
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
        isFramed: true,
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
        isFramed: false,
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
        isFramed: true,
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
        isFramed: true,
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
        isFramed: false,
      },
      {
        title: "Spring Bloom",
        description: "Delicate watercolor painting of spring flowers in bloom, capturing their fragile beauty and vibrant colors.",
        medium: "watercolor",
        imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb",
        price: 390,
        size: "16\" x 20\"",
        year: "2023",
        isFeatured: false,
        inStock: true,
        isFramed: true,
      },
      {
        title: "Alpine Sunset",
        description: "Oil painting depicting a stunning mountain lake at sunset, with dramatic colors reflecting in the still waters.",
        medium: "oil",
        imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1",
        price: 720,
        size: "36\" x 48\"",
        year: "2022",
        isFeatured: false,
        inStock: true,
        isFramed: true,
      },
      {
        title: "Geometric Dreams",
        description: "Abstract geometric patterns in bright colors, representing the structured nature of subconscious thought.",
        medium: "acrylic",
        imageUrl: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43",
        price: 550,
        size: "24\" x 24\"",
        year: "2022",
        isFeatured: false,
        inStock: true,
        isFramed: false,
      },
      {
        title: "Misty Forest",
        description: "A beautifully atmospheric watercolor of a forest shrouded in morning mist, evoking a sense of mystery and calm.",
        medium: "watercolor",
        imageUrl: "https://images.unsplash.com/photo-1603784022420-9303a2120d12",
        price: 450,
        size: "20\" x 30\"",
        year: "2023",
        isFeatured: false,
        inStock: true,
        isFramed: true,
      }
    ];

    // Sample workshops
    const sampleWorkshops: InsertWorkshop[] = [
      {
        title: "Oil Painting Fundamentals",
        description: "Learn the basics of oil painting including color mixing, layering techniques, and composition. All materials provided.",
        price: 120,
        date: "June 15, 2023",
        time: "10:00 AM - 2:00 PM",
        location: "Art Studio, 123 Creative Ave, City",
        type: "in-person",
        imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
        spotsAvailable: 5,
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
        spotsAvailable: 12,
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
        spotsAvailable: 8,
      },
      {
        title: "Portrait Painting Techniques",
        description: "Master the art of portrait painting with oil paints. Focus on facial features, expressions, and capturing personality.",
        price: 150,
        date: "July 18, 2023",
        time: "11:00 AM - 3:00 PM",
        location: "Diganth Studio, 123 Artist Way",
        type: "in-person",
        imageUrl: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71",
        spotsAvailable: 6,
      },
      {
        title: "Digital Watercolor Effects",
        description: "Learn to create digital paintings with authentic watercolor effects using digital tools.",
        price: 75,
        date: "August 3, 2023",
        time: "7:00 PM - 9:00 PM",
        location: "Zoom Session (Link sent after registration)",
        type: "online",
        imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d",
        spotsAvailable: 15,
      }
    ];

    // Save sample data
    sampleArtworks.forEach(artwork => this.createArtwork(artwork));
    sampleWorkshops.forEach(workshop => this.createWorkshop(workshop));
  }

  // Artwork methods
  async getAllArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values());
  }

  async getArtworkById(id: number): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async getArtworksByMedium(medium: string): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(
      artwork => artwork.medium === medium
    );
  }

  async getFeaturedArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).filter(
      artwork => artwork.isFeatured
    );
  }

  async createArtwork(artwork: InsertArtwork): Promise<Artwork> {
    const id = this.currentIds.artwork++;
    
    // Create a new object with all required properties explicitly defined
    const newArtwork: Artwork = {
      id,
      title: artwork.title,
      description: artwork.description,
      medium: artwork.medium,
      size: artwork.size,
      price: artwork.price,
      imageUrl: artwork.imageUrl,
      year: artwork.year,
      isFeatured: artwork.isFeatured ?? false,
      inStock: artwork.inStock ?? true,
      isFramed: artwork.isFramed ?? false
    };
    
    this.artworks.set(id, newArtwork);
    return newArtwork;
  }

  async updateArtwork(id: number, artwork: Partial<InsertArtwork>): Promise<Artwork | undefined> {
    const existingArtwork = this.artworks.get(id);
    if (!existingArtwork) return undefined;

    const updatedArtwork = { ...existingArtwork, ...artwork };
    this.artworks.set(id, updatedArtwork);
    return updatedArtwork;
  }

  async deleteArtwork(id: number): Promise<boolean> {
    return this.artworks.delete(id);
  }

  // Workshop methods
  async getAllWorkshops(): Promise<Workshop[]> {
    return Array.from(this.workshops.values());
  }

  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    return this.workshops.get(id);
  }

  async getWorkshopsByType(type: string): Promise<Workshop[]> {
    return Array.from(this.workshops.values()).filter(
      workshop => workshop.type === type
    );
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const id = this.currentIds.workshop++;
    const newWorkshop: Workshop = { ...workshop, id };
    this.workshops.set(id, newWorkshop);
    return newWorkshop;
  }

  async updateWorkshop(id: number, workshop: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const existingWorkshop = this.workshops.get(id);
    if (!existingWorkshop) return undefined;

    const updatedWorkshop = { ...existingWorkshop, ...workshop };
    this.workshops.set(id, updatedWorkshop);
    return updatedWorkshop;
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    return this.workshops.delete(id);
  }

  // Registration methods
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const id = this.currentIds.registration++;
    const now = new Date();
    const newRegistration: Registration = { 
      ...registration, 
      id, 
      createdAt: now 
    };
    this.registrations.set(id, newRegistration);
    
    // Update available spots for the workshop
    const workshop = await this.getWorkshopById(registration.workshopId);
    if (workshop && workshop.spotsAvailable > 0) {
      await this.updateWorkshop(workshop.id, { 
        spotsAvailable: workshop.spotsAvailable - 1 
      });
    }
    
    return newRegistration;
  }

  async getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.workshopId === workshopId
    );
  }

  // Contact methods
  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentIds.contact++;
    const now = new Date();
    const newContact: Contact = { ...contact, id, createdAt: now };
    this.contacts.set(id, newContact);
    return newContact;
  }

  // Subscriber methods
  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      s => s.email === subscriber.email
    );
    
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.currentIds.subscriber++;
    const now = new Date();
    const newSubscriber: Subscriber = { ...subscriber, id, createdAt: now };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  // Order methods
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.currentIds.order++;
    const now = new Date();
    
    // Create a new order with all required properties explicitly defined
    const newOrder: Order = {
      id,
      email: order.email,
      total: order.total,
      status: order.status || 'pending',
      createdAt: now
    };
    
    this.orders.set(id, newOrder);
    
    const orderItems: OrderItem[] = items.map(item => {
      const itemId = this.currentIds.orderItem++;
      return { ...item, id: itemId, orderId: id };
    });
    
    this.orderItems.set(id, orderItems);
    
    // Update artwork stock
    for (const item of items) {
      const artwork = await this.getArtworkById(item.artworkId);
      if (artwork && artwork.inStock) {
        await this.updateArtwork(artwork.id, { inStock: false });
      }
    }
    
    return newOrder;
  }

  async getOrderById(id: number): Promise<{ order: Order, items: OrderItem[] } | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = this.orderItems.get(id) || [];
    return { order, items };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

// Import the PgStorage class
import { PgStorage } from './pgStorage';

// Export both storage implementations and use PgStorage for database persistence
export { PgStorage };
export const storage = new PgStorage();
