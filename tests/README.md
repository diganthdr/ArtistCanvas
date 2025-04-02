# Diganth Art Portfolio - Testing Resources

This directory contains testing resources for the Diganth Art Portfolio website.

## Manual Test Plans

### Admin Functionality Test Plan (`admin-tests.md`)

This document outlines comprehensive manual tests for all admin functionality to ensure the website works correctly from an admin user's perspective. It includes tests for:

- Artwork management (adding, editing, deleting)
- Workshop management
- Order management
- Registration management
- Contact form and newsletter subscriber management
- Image uploads
- Responsiveness
- Security

Use this document as a checklist when performing manual testing before deploying new features.

## Automated API Tests

These JavaScript files contain automated tests for the website's API endpoints:

### Artwork API Tests (`artwork-api-tests.js`)

Tests the following artwork-related endpoints:
- GET /api/artworks
- POST /api/artworks
- GET /api/artworks/:id
- PATCH /api/artworks/:id
- DELETE /api/artworks/:id
- GET /api/artworks/featured
- GET /api/artworks/medium/:medium

### Workshop API Tests (`workshop-api-tests.js`)

Tests the following workshop-related endpoints:
- GET /api/workshops
- POST /api/workshops
- GET /api/workshops/:id
- PATCH /api/workshops/:id
- DELETE /api/workshops/:id
- GET /api/workshops/type/:type
- POST /api/registrations
- GET /api/workshops/:id/registrations
- POST /api/workshops/:id/notify

### Order API Tests (`order-api-tests.js`)

Tests the following order-related endpoints:
- POST /api/orders
- GET /api/orders/:id
- PATCH /api/orders/:id/status
- GET /api/orders

## Running the Automated Tests

To run the automated API tests:

1. Make sure the application is running (using `npm run dev` from the project root)
2. Navigate to the tests directory:
   ```
   cd tests
   ```
3. Install the required dependencies:
   ```
   npm install
   ```
4. Run the tests using the npm scripts:
   ```
   npm run test:artwork    # Run artwork API tests
   npm run test:workshop   # Run workshop API tests
   npm run test:order      # Run order API tests
   npm run test:all        # Run all API tests
   ```

Alternatively, you can run individual test files directly:
```
node artwork-api-tests.js
node workshop-api-tests.js
node order-api-tests.js
```

> **Note:** These tests will create, modify, and delete actual data in your database. It's recommended to run them in a development environment, not production.

## Key Testing Tips

1. Always test the core user flows (artwork browsing, workshop registration, checkout) after making changes.
2. Test both the customer-facing site and admin functionality.
3. Test on multiple browsers and devices when possible.
4. After fixing bugs, add specific tests for those scenarios to prevent regressions.
5. Test database functionality both through the API and through the UI.