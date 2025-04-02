import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToDatabase, runMigrations } from "./database";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Connect to the database and run migrations
  try {
    await connectToDatabase();
    log('Successfully connected to the database');
    
    // Run migrations
    await runMigrations();
    log('Database migrations completed successfully');
    
    // Run custom migration to add email and reset columns
    try {
      log('Running custom migration to add email and reset columns...');
      const emailResetModule = await import('../migrations/add-email-reset-columns.js');
      await emailResetModule.default();
      log('Email and reset columns migration completed successfully');
    } catch (migrationError) {
      log('Error running email and reset columns migration: ' + (migrationError as Error).message);
      // Continue even if this migration fails
    }
    
    // Now run the seed script 
    try {
      log('Running database seed script...');
      const seedModule = await import('../migrations/seed.js');
      await seedModule.default();
      log('Database seed completed successfully');
    } catch (seedError) {
      log('Error running seed script: ' + (seedError as Error).message);
      // Continue even if seeding fails
    }
  } catch (error) {
    log('Failed to connect to the database or run migrations. Exiting...');
    console.error(error);
    process.exit(1);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
