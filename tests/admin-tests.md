# Admin Functionality Test Plan

This document outlines manual testing procedures for the admin functionality of the Diganth Art Portfolio website.

## Prerequisites

- Ensure the application is running (`npm run dev` from project root)
- Navigate to the admin interface at `/admin` route
- Database should be properly connected and migrated

## Test Cases

### 1. Admin Authentication

- **Test ID**: AUTH-01
- **Description**: Verify that admin login works correctly
- **Steps**:
  1. Navigate to `/admin/login`
  2. Enter valid credentials
  3. Submit the form
- **Expected Result**: Successfully logged in and redirected to admin dashboard
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

### 2. Artwork Management

#### 2.1 View Artwork List

- **Test ID**: ART-01
- **Description**: Verify admin can view the list of artworks
- **Steps**:
  1. Navigate to Admin Dashboard
  2. Click on "Artworks" in the navigation menu
- **Expected Result**: List of artworks displayed with thumbnails and details
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 2.2 Add New Artwork

- **Test ID**: ART-02
- **Description**: Verify admin can add a new artwork
- **Steps**:
  1. Navigate to Admin > Artworks
  2. Click "Add New Artwork" button
  3. Fill in the artwork details:
     - Title: "Test Artwork"
     - Description: "This is a test artwork"
     - Medium: "Acrylic"
     - Size: "12\" x 16\""
     - Price: 299.99
     - Year: "2023"
     - Featured: Yes
     - In Stock: Yes
     - Framed: No
  4. Upload an image
  5. Submit the form
- **Expected Result**: 
  - Success message displayed
  - New artwork appears in the artwork list
  - Image is properly uploaded and displayed
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 2.3 Edit Existing Artwork

- **Test ID**: ART-03
- **Description**: Verify admin can edit an artwork
- **Steps**:
  1. Navigate to Admin > Artworks
  2. Click "Edit" on an existing artwork (preferably the "Test Artwork" created in ART-02)
  3. Modify the following details:
     - Title: "Updated Test Artwork"
     - Price: 349.99
  4. Save changes
- **Expected Result**: 
  - Success message displayed
  - Artwork details updated in the list
  - Changes reflected on the public site
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 2.4 Delete Artwork

- **Test ID**: ART-04
- **Description**: Verify admin can delete an artwork
- **Steps**:
  1. Navigate to Admin > Artworks
  2. Click "Delete" on the test artwork
  3. Confirm deletion
- **Expected Result**: 
  - Success message displayed
  - Artwork removed from the list
  - Artwork no longer visible on the public site
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

### 3. Workshop Management

#### 3.1 View Workshop List

- **Test ID**: WS-01
- **Description**: Verify admin can view the list of workshops
- **Steps**:
  1. Navigate to Admin Dashboard
  2. Click on "Workshops" in the navigation menu
- **Expected Result**: List of workshops displayed with details
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 3.2 Add New Workshop

- **Test ID**: WS-02
- **Description**: Verify admin can add a new workshop
- **Steps**:
  1. Navigate to Admin > Workshops
  2. Click "Add New Workshop" button
  3. Fill in the workshop details:
     - Title: "Test Workshop"
     - Description: "This is a test workshop"
     - Price: 99.99
     - Date: Select a future date
     - Time: "10:00 AM - 1:00 PM"
     - Location: "Studio 123, Main Street"
     - Type: "in-person"
     - Spots Available: 10
  4. Upload an image
  5. Submit the form
- **Expected Result**: 
  - Success message displayed
  - New workshop appears in the workshop list
  - Workshop appears on the public site
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 3.3 Edit Existing Workshop

- **Test ID**: WS-03
- **Description**: Verify admin can edit a workshop
- **Steps**:
  1. Navigate to Admin > Workshops
  2. Click "Edit" on the test workshop
  3. Modify the following details:
     - Title: "Updated Test Workshop"
     - Spots Available: 8
  4. Save changes
- **Expected Result**: 
  - Success message displayed
  - Workshop details updated in the list
  - Changes reflected on the public site
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 3.4 View Workshop Registrations

- **Test ID**: WS-04
- **Description**: Verify admin can view registrations for a workshop
- **Steps**:
  1. Navigate to Admin > Workshops
  2. Click "View Registrations" on a workshop with registrations
- **Expected Result**: List of registrations displayed with student information
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 3.5 Notify Workshop Students

- **Test ID**: WS-05
- **Description**: Verify admin can send notifications to workshop students
- **Steps**:
  1. Navigate to Admin > Workshops
  2. Click "Notify Students" on a workshop with registrations
  3. Enter subject: "Test Notification"
  4. Enter message: "This is a test message for workshop participants."
  5. Submit the form
- **Expected Result**: Success message confirming notification has been sent
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 3.6 Delete Workshop

- **Test ID**: WS-06
- **Description**: Verify admin can delete a workshop
- **Steps**:
  1. Navigate to Admin > Workshops
  2. Click "Delete" on the test workshop
  3. Confirm deletion
- **Expected Result**: 
  - Success message displayed
  - Workshop removed from the list
  - Workshop no longer visible on the public site
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

### 4. Order Management

#### 4.1 View Orders

- **Test ID**: ORD-01
- **Description**: Verify admin can view orders
- **Steps**:
  1. Navigate to Admin Dashboard
  2. Click on "Orders" in the navigation menu
- **Expected Result**: List of orders displayed with order details
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 4.2 View Order Details

- **Test ID**: ORD-02
- **Description**: Verify admin can view detailed information about an order
- **Steps**:
  1. Navigate to Admin > Orders
  2. Click "View Details" on an existing order
- **Expected Result**: 
  - Order details displayed
  - Customer information displayed
  - Items in order listed with price information
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 4.3 Update Order Status

- **Test ID**: ORD-03
- **Description**: Verify admin can update the status of an order
- **Steps**:
  1. Navigate to Admin > Orders
  2. Select an order
  3. Change status from "pending" to "completed"
  4. Save changes
- **Expected Result**: 
  - Success message displayed
  - Order status updated in the orders list
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

### 5. Contact and Subscriber Management

#### 5.1 View Contact Submissions

- **Test ID**: CONT-01
- **Description**: Verify admin can view contact form submissions
- **Steps**:
  1. Navigate to Admin Dashboard
  2. Click on "Contacts" in the navigation menu
- **Expected Result**: List of contact form submissions displayed
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 5.2 View Contact Details

- **Test ID**: CONT-02
- **Description**: Verify admin can view detailed information about a contact submission
- **Steps**:
  1. Navigate to Admin > Contacts
  2. Click "View" on an existing contact submission
- **Expected Result**: Full contact form details displayed
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 5.3 View Newsletter Subscribers

- **Test ID**: SUB-01
- **Description**: Verify admin can view newsletter subscribers
- **Steps**:
  1. Navigate to Admin Dashboard
  2. Click on "Subscribers" in the navigation menu
- **Expected Result**: List of newsletter subscribers displayed
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

### 6. Cross-cutting Concerns

#### 6.1 Image Upload Functionality

- **Test ID**: IMG-01
- **Description**: Verify image upload works for both artworks and workshops
- **Steps**:
  1. Attempt to upload images of various formats (JPG, PNG, GIF)
  2. Attempt to upload very large images (>5MB)
  3. Attempt to upload very small images (<50KB)
- **Expected Result**: 
  - Valid images are uploaded successfully
  - Error messages displayed for invalid uploads
  - Thumbnails generated correctly
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 6.2 Mobile Responsiveness

- **Test ID**: RESP-01
- **Description**: Verify admin interface is responsive on mobile devices
- **Steps**:
  1. Access admin interface on a mobile device or using browser's mobile emulator
  2. Test all major admin functions
- **Expected Result**: Interface adjusts appropriately to screen size, all functions usable
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 6.3 Form Validation

- **Test ID**: FORM-01
- **Description**: Verify all admin forms have proper validation
- **Steps**:
  1. Try submitting forms with missing required fields
  2. Try submitting forms with invalid data (e.g., text in number fields)
- **Expected Result**: 
  - Appropriate error messages displayed
  - Forms not submitted until errors are corrected
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

#### 6.4 Security

- **Test ID**: SEC-01
- **Description**: Verify admin routes are protected
- **Steps**:
  1. Log out of admin account
  2. Attempt to access admin routes directly via URL
- **Expected Result**: Redirected to login page
- **Status**: [ ] Pass [ ] Fail
- **Notes**:

## Test Execution

| Test ID | Date | Tester | Status | Notes |
|---------|------|--------|--------|-------|
| AUTH-01 |      |        |        |       |
| ART-01  |      |        |        |       |
| ART-02  |      |        |        |       |
| ART-03  |      |        |        |       |
| ART-04  |      |        |        |       |
| WS-01   |      |        |        |       |
| WS-02   |      |        |        |       |
| WS-03   |      |        |        |       |
| WS-04   |      |        |        |       |
| WS-05   |      |        |        |       |
| WS-06   |      |        |        |       |
| ORD-01  |      |        |        |       |
| ORD-02  |      |        |        |       |
| ORD-03  |      |        |        |       |
| CONT-01 |      |        |        |       |
| CONT-02 |      |        |        |       |
| SUB-01  |      |        |        |       |
| IMG-01  |      |        |        |       |
| RESP-01 |      |        |        |       |
| FORM-01 |      |        |        |       |
| SEC-01  |      |        |        |       |

## Issues and Action Items

| Issue ID | Description | Severity | Action | Status |
|----------|-------------|----------|--------|--------|
|          |             |          |        |        |