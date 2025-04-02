import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertArtworkSchema, 
  insertWorkshopSchema, 
  insertRegistrationSchema,
  insertContactSchema,
  insertSubscriberSchema,
  insertOrderSchema,
  insertOrderItemSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  const { isAdmin } = setupAuth(app);

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  // Configure multer for file uploads
  const multerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, imagesDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const upload = multer({ 
    storage: multerStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
      // Allow only image files
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
      }
    }
  });
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Error handling middleware for Zod validation errors
  const handleZodError = (err: unknown, res: Response) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ message: validationError.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  };

  // Artwork routes
  app.get("/api/artworks", async (_req, res) => {
    try {
      const artworks = await storage.getAllArtworks();
      res.json(artworks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch artworks" });
    }
  });

  app.get("/api/artworks/featured", async (_req, res) => {
    try {
      const artworks = await storage.getFeaturedArtworks();
      res.json(artworks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch featured artworks" });
    }
  });

  app.get("/api/artworks/medium/:medium", async (req, res) => {
    try {
      const medium = req.params.medium;
      const artworks = await storage.getArtworksByMedium(medium);
      res.json(artworks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch artworks by medium" });
    }
  });

  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artwork ID" });
      }

      const artwork = await storage.getArtworkById(id);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }

      res.json(artwork);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch artwork" });
    }
  });

  app.post("/api/artworks", isAdmin, async (req, res) => {
    try {
      const artworkData = insertArtworkSchema.parse(req.body);
      const artwork = await storage.createArtwork(artworkData);
      res.status(201).json(artwork);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.patch("/api/artworks/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artwork ID" });
      }

      const artworkData = insertArtworkSchema.partial().parse(req.body);
      const artwork = await storage.updateArtwork(id, artworkData);
      
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }

      res.json(artwork);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Keep the PUT endpoint for backward compatibility
  app.put("/api/artworks/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artwork ID" });
      }

      const artworkData = insertArtworkSchema.partial().parse(req.body);
      const artwork = await storage.updateArtwork(id, artworkData);
      
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }

      res.json(artwork);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.delete("/api/artworks/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artwork ID" });
      }

      const success = await storage.deleteArtwork(id);
      if (!success) {
        return res.status(404).json({ message: "Artwork not found" });
      }

      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete artwork" });
    }
  });
  
  // Image upload endpoint for artworks
  app.post("/api/upload/image", isAdmin, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the path where the image was stored
      const imagePath = `/uploads/images/${req.file.filename}`;
      res.status(201).json({ 
        imagePath,
        message: "File uploaded successfully" 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Workshop routes
  app.get("/api/workshops", async (_req, res) => {
    try {
      const workshops = await storage.getAllWorkshops();
      res.json(workshops);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch workshops" });
    }
  });

  app.get("/api/workshops/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const workshops = await storage.getWorkshopsByType(type);
      res.json(workshops);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch workshops by type" });
    }
  });

  app.get("/api/workshops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workshop ID" });
      }

      const workshop = await storage.getWorkshopById(id);
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }

      res.json(workshop);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch workshop" });
    }
  });

  app.post("/api/workshops", isAdmin, async (req, res) => {
    try {
      const workshopData = insertWorkshopSchema.parse(req.body);
      const workshop = await storage.createWorkshop(workshopData);
      res.status(201).json(workshop);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.patch("/api/workshops/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workshop ID" });
      }

      const workshopData = insertWorkshopSchema.partial().parse(req.body);
      const workshop = await storage.updateWorkshop(id, workshopData);
      
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }

      res.json(workshop);
    } catch (err) {
      handleZodError(err, res);
    }
  });
  
  // Keep the PUT endpoint for backward compatibility
  app.put("/api/workshops/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workshop ID" });
      }

      const workshopData = insertWorkshopSchema.partial().parse(req.body);
      const workshop = await storage.updateWorkshop(id, workshopData);
      
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }

      res.json(workshop);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Registration routes
  app.post("/api/registrations", async (req, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      
      // Check if workshop exists and has spots available
      const workshop = await storage.getWorkshopById(registrationData.workshopId);
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      if (workshop.spotsAvailable <= 0) {
        return res.status(400).json({ message: "No spots available for this workshop" });
      }
      
      const registration = await storage.createRegistration(registrationData);
      
      // Send confirmation email to the student (in a real app, this would use an email service)
      console.log(`[Workshop Registration] Confirmation email sent to ${registration.email} for workshop "${workshop.title}"`);
      
      res.status(201).json({
        ...registration,
        notificationSent: true
      });
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.get("/api/workshops/:id/registrations", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workshop ID" });
      }

      const registrations = await storage.getRegistrationsByWorkshopId(id);
      res.json(registrations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });
  
  // Workshop notification endpoint for admin to send updates to all registered students
  app.post("/api/workshops/:id/notify", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workshop ID" });
      }
      
      // Get the workshop details
      const workshop = await storage.getWorkshopById(id);
      if (!workshop) {
        return res.status(404).json({ message: "Workshop not found" });
      }
      
      // Get all registrations for this workshop
      const registrations = await storage.getRegistrationsByWorkshopId(id);
      if (registrations.length === 0) {
        return res.status(404).json({ message: "No registrations found for this workshop" });
      }
      
      // Extract the message from the request body
      const { subject, message } = req.body;
      if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required" });
      }
      
      // In a real app, send emails to all registered students
      // For this example, just log the notifications
      console.log(`[Workshop Update] Notification sent for "${workshop.title}"`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Recipients: ${registrations.map(r => r.email).join(', ')}`);
      
      res.status(200).json({ 
        message: "Notifications sent successfully", 
        recipientCount: registrations.length,
        workshopTitle: workshop.title
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send notifications" });
    }
  });

  // Contact routes
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Newsletter subscriber routes
  app.post("/api/subscribers", async (req, res) => {
    try {
      const subscriberData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(subscriberData);
      res.status(201).json(subscriber);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  // Password reset routes
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if the email exists or not for security reasons
        return res.status(200).json({ message: "If your email is registered with us, you will receive a password reset link shortly." });
      }
      
      // Generate a random token
      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set the token to expire in 1 hour
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1);
      
      // Save the token in the database
      const success = await storage.setResetToken(email, token, expiry);
      if (!success) {
        return res.status(500).json({ message: "Failed to generate reset token" });
      }
      
      // In a real app, send an email with the reset link
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;
      console.log(`[Password Reset] Link generated for ${email}: ${resetLink}`);
      
      res.status(200).json({ 
        message: "If your email is registered with us, you will receive a password reset link shortly.",
        resetLink // In a real app, don't send this in the response, but for testing/demo purposes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
  
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Reset token is required" });
      }
      
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }
      
      // Verify the token and get the user
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      
      // Hash the new password
      const { scrypt, randomBytes } = require('crypto');
      const { promisify } = require('util');
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(newPassword, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      // Update the password and clear the reset token
      const success = await storage.updatePassword(user.id, hashedPassword);
      if (!success) {
        return res.status(500).json({ message: "Failed to update password" });
      }
      
      res.status(200).json({ message: "Password has been updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      const orderItemsData = items.map((item: any) => insertOrderItemSchema.parse(item));
      
      // Validate that all artworks exist and are in stock
      for (const item of orderItemsData) {
        const artwork = await storage.getArtworkById(item.artworkId);
        if (!artwork) {
          return res.status(404).json({ message: `Artwork with ID ${item.artworkId} not found` });
        }
        if (!artwork.inStock) {
          return res.status(400).json({ message: `Artwork "${artwork.title}" is not in stock` });
        }
      }
      
      const createdOrder = await storage.createOrder(orderData, orderItemsData);
      res.status(201).json(createdOrder);
    } catch (err) {
      handleZodError(err, res);
    }
  });

  app.get("/api/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const orderData = await storage.getOrderById(id);
      if (!orderData) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(orderData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
