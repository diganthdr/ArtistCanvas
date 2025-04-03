# Diganth's Art Portfolio & E-commerce Platform

A comprehensive art portfolio and e-commerce website for showcasing and selling artwork, with integrated workshop management functionality.

## Features

### For Visitors
- **Responsive Art Gallery**: Browse artworks with advanced filtering by medium, price range, and availability
- **Artwork Details**: View high-resolution images and detailed information about each artwork
- **Shopping Cart**: Add artworks to cart and proceed through a streamlined checkout process
- **Workshop Registration**: Browse and register for upcoming art workshops and classes
- **Contact Form**: Get in touch with the artist through a simple contact form

### For Administrators
- **Secure Admin Panel**: Protected admin interface accessible only through "/admin" URL
- **Content Management**: Add, edit, and delete artworks and workshops
- **Image Upload**: Upload and manage artwork images directly through the interface
- **Workshop Management**: Track workshop registrations and manage participant information
- **Password Reset**: Secure password reset functionality for admin users

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with Shadcn UI component library
- **State Management**: React Context API and TanStack Query
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend
- **Server**: Express.js running on Node.js
- **API**: RESTful API architecture
- **Authentication**: Passport.js with express-session for session management
- **Security**: bcryptjs for password hashing, middleware for route protection
- **File Handling**: Multer for file uploads and static file serving

### Database
- **DBMS**: PostgreSQL
- **ORM**: Drizzle ORM for typesafe database operations
- **Schema**: Zod for runtime type validation
- **Migrations**: Drizzle Kit for schema migrations

### Development
- **Bundler**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend and backend
- **ESM Modules**: Modern JavaScript module system throughout

## Prerequisites

- Node.js v18+ and npm
- PostgreSQL database
- Git

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/diganth-art-portfolio.git
   cd diganth-art-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/diganth_art
   
   # Session Secret (used for encrypting session cookies)
   SESSION_SECRET=your-secret-key
   
   # Optional: File Upload Settings
   # MAX_FILE_SIZE=5242880  # 5MB in bytes
   # UPLOAD_PATH=uploads
   
   # Optional: Razorpay Payment Gateway (when implementing payment)
   # RAZORPAY_KEY_ID=your-razorpay-key-id
   # RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```
   
   Notes on database connection string:
   - For local development: `postgresql://username:password@localhost:5432/diganth_art`
   - For Replit PostgreSQL: Use the provided `DATABASE_URL` from Replit
   - For production with SSL: `postgresql://username:password@host:port/database?sslmode=require`

4. **Initialize and set up the database**

   ```bash
   # Push the schema to the database
   npm run db:push
   
   # The application will automatically run migrations and seed data on startup
   # You can also run migrations manually by executing:
   node --loader ts-node/esm migrations/migrate.ts
   ```

## Running the Application

### Development Mode

Run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Mode

Build and run the application for production:

```bash
npm run build
npm start
```

## Admin Access

Access the admin dashboard by navigating to `/admin` with the following default credentials:

- **Username**: admin
- **Password**: admin@420

For security reasons, please change the admin password after initial login.

## Deployment

### Deploy on a VPS or Dedicated Server

1. **Set up a server** with Node.js and PostgreSQL installed

2. **Clone and set up the project** as described in the installation section

3. **Configure a process manager** (recommended: PM2)

   ```bash
   npm install -g pm2
   pm2 start npm --name "diganth-art" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up a reverse proxy** with Nginx or Apache

   Example Nginx configuration:

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL** with Let's Encrypt for secure HTTPS connections

   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### Deploy on Replit

1. **Create a new Repl** with the "Import from GitHub" option

2. **Set up environment variables** in the Replit Secrets panel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A strong random string for session encryption

3. **Configure the Run command** to use `npm run dev`

4. **Run the application** by clicking the Run button 

5. **Deploy to Replit Deployments**:
   - Click the "Deploy" button in the top right
   - Configure domain settings as needed
   - Complete the deployment process

6. **Access your deployed site** at the provided Replit URL or your custom domain

## File Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
├── server/                # Backend Express application
│   ├── db.ts              # Database connection
│   ├── index.ts           # Express server setup
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database access layer
│   └── auth.ts            # Authentication setup
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Database schema and types
├── uploads/               # Uploaded files storage
└── package.json           # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get artwork by ID
- `GET /api/artworks/featured` - Get featured artworks
- `POST /api/artworks` - Create new artwork (admin only)
- `PUT /api/artworks/:id` - Update artwork (admin only)
- `DELETE /api/artworks/:id` - Delete artwork (admin only)

### Workshops
- `GET /api/workshops` - Get all workshops
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops` - Create new workshop (admin only)
- `PUT /api/workshops/:id` - Update workshop (admin only)
- `DELETE /api/workshops/:id` - Delete workshop (admin only)
- `POST /api/workshops/:id/register` - Register for a workshop

### File Upload
- `POST /api/upload/image` - Upload an image file

## Testing

The project includes API tests for artworks, workshops and order functionality:

```bash
# Run the artwork API tests
node tests/artwork-api-tests.js

# Run the workshop API tests
node tests/workshop-api-tests.js

# Run the workshop registration tests
node tests/workshop-registration-tests.js

# Run the order API tests
node tests/order-api-tests.js
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your PostgreSQL service is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Check your connection string format:
   - Local development: `postgresql://username:password@localhost:5432/diganth_art`
   - With SSL: Add `?sslmode=require` to the end of your connection string

3. Reset the admin password:
   ```sql
   -- This updates the password to "admin@420"
   UPDATE users SET password = '$2b$10$dukNr/eZpLUe2eAjUQ1K8uk9ZPJxVEQVRNgCa6cHgR8Af97wLdt0C' WHERE username = 'admin';
   ```
   
   Alternatively, generate a new bcrypt hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_new_password', 10));"
   ```

### File Upload Issues

If file uploads are failing:

1. Check that the uploads directory exists and has proper permissions:
   ```bash
   mkdir -p uploads
   chmod 755 uploads
   ```

2. Verify file size limits in your code or environment variables
   
3. Check for the correct `enctype="multipart/form-data"` attribute in your HTML forms

### Authentication Issues

If you can't log in as admin:

1. Reset the admin password using the SQL command above
   
2. Ensure session middleware is properly configured with a valid SESSION_SECRET

3. Clear browser cookies and cache, then try logging in again

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact [your-email@example.com](mailto:your-email@example.com).