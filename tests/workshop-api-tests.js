/**
 * Workshop API Tests
 * 
 * This script provides automated tests for the Workshop-related API endpoints.
 * Run this script with Node.js to verify API functionality.
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_WORKSHOP = {
  title: 'Test Workshop for API Check',
  description: 'This is a test workshop created by the automated test script',
  price: 75,
  date: '2023-12-15',
  time: '10:00 AM - 2:00 PM',
  location: 'Art Studio, 123 Main Street',
  type: 'in-person',
  imageUrl: '/uploads/images/test-workshop.jpg',
  spotsAvailable: 10
};

const TEST_REGISTRATION = {
  workshopId: null, // Will be set dynamically
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '555-123-4567',
  experienceLevel: 'beginner'
};

// Helper function for API calls
async function callAPI(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const responseData = await response.json();
  
  return {
    status: response.status,
    data: responseData,
  };
}

// Test functions
async function testGetAllWorkshops() {
  console.log('Testing GET /workshops endpoint...');
  const response = await callAPI('/workshops');
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log('✅ Successfully retrieved workshops list');
    console.log(`   Found ${response.data.length} workshops`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve workshops list');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testCreateWorkshop() {
  console.log('Testing POST /workshops endpoint...');
  const response = await callAPI('/workshops', 'POST', TEST_WORKSHOP);
  
  if (response.status === 201 && response.data.id) {
    console.log('✅ Successfully created test workshop');
    console.log(`   Created workshop with ID: ${response.data.id}`);
    return response.data;
  } else {
    console.log('❌ Failed to create test workshop');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testGetWorkshopById(id) {
  console.log(`Testing GET /workshops/${id} endpoint...`);
  const response = await callAPI(`/workshops/${id}`);
  
  if (response.status === 200 && response.data.id === id) {
    console.log('✅ Successfully retrieved workshop by ID');
    return response.data;
  } else {
    console.log('❌ Failed to retrieve workshop by ID');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testUpdateWorkshop(id) {
  console.log(`Testing PATCH /workshops/${id} endpoint...`);
  const updatedFields = {
    title: `${TEST_WORKSHOP.title} (Updated)`,
    price: TEST_WORKSHOP.price + 15,
    spotsAvailable: TEST_WORKSHOP.spotsAvailable - 2,
  };
  
  const response = await callAPI(`/workshops/${id}`, 'PATCH', updatedFields);
  
  if (response.status === 200 && response.data.title === updatedFields.title) {
    console.log('✅ Successfully updated workshop');
    return response.data;
  } else {
    console.log('❌ Failed to update workshop');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testRegisterForWorkshop(workshopId) {
  console.log(`Testing POST /registrations endpoint...`);
  const registrationData = {
    ...TEST_REGISTRATION,
    workshopId
  };
  
  const response = await callAPI('/registrations', 'POST', registrationData);
  
  if (response.status === 201 && response.data.id) {
    console.log('✅ Successfully registered for workshop');
    console.log(`   Created registration with ID: ${response.data.id}`);
    return response.data;
  } else {
    console.log('❌ Failed to register for workshop');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testGetRegistrationsForWorkshop(workshopId) {
  console.log(`Testing GET /workshops/${workshopId}/registrations endpoint...`);
  const response = await callAPI(`/workshops/${workshopId}/registrations`);
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log('✅ Successfully retrieved workshop registrations');
    console.log(`   Found ${response.data.length} registrations`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve workshop registrations');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testDeleteWorkshop(id) {
  console.log(`Testing DELETE /workshops/${id} endpoint...`);
  const response = await callAPI(`/workshops/${id}`, 'DELETE');
  
  if (response.status === 200) {
    console.log('✅ Successfully deleted workshop');
    return true;
  } else {
    console.log('❌ Failed to delete workshop');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testGetWorkshopsByType(type) {
  console.log(`Testing GET /workshops/type/${type} endpoint...`);
  const response = await callAPI(`/workshops/type/${type}`);
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log(`✅ Successfully retrieved workshops with type '${type}'`);
    console.log(`   Found ${response.data.length} workshops`);
    return response.data;
  } else {
    console.log(`❌ Failed to retrieve workshops with type '${type}'`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testNotifyWorkshopParticipants(workshopId) {
  console.log(`Testing POST /workshops/${workshopId}/notify endpoint...`);
  const notificationData = {
    subject: 'Test Notification',
    message: 'This is a test notification for workshop participants.',
  };
  
  const response = await callAPI(`/workshops/${workshopId}/notify`, 'POST', notificationData);
  
  if (response.status === 200) {
    console.log('✅ Successfully sent notifications to workshop participants');
    return true;
  } else {
    console.log('❌ Failed to send notifications to workshop participants');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('=== Starting Workshop API Tests ===\n');
  
  // Test retrieving all workshops
  const allWorkshops = await testGetAllWorkshops();
  console.log();
  
  // Test retrieving workshops by type
  const inPersonWorkshops = await testGetWorkshopsByType('in-person');
  console.log();
  
  // Test creating a new workshop
  const createdWorkshop = await testCreateWorkshop();
  console.log();
  
  if (createdWorkshop) {
    // Test getting workshop by ID
    const retrievedWorkshop = await testGetWorkshopById(createdWorkshop.id);
    console.log();
    
    if (retrievedWorkshop) {
      // Test updating workshop
      const updatedWorkshop = await testUpdateWorkshop(createdWorkshop.id);
      console.log();
      
      // Test registering for a workshop
      const registration = await testRegisterForWorkshop(createdWorkshop.id);
      console.log();
      
      if (registration) {
        // Test getting registrations for a workshop
        const registrations = await testGetRegistrationsForWorkshop(createdWorkshop.id);
        console.log();
        
        // Test notifying workshop participants
        if (registrations.length > 0) {
          await testNotifyWorkshopParticipants(createdWorkshop.id);
          console.log();
        }
      }
      
      // Test deleting workshop
      await testDeleteWorkshop(createdWorkshop.id);
      console.log();
    }
  }
  
  console.log('=== Workshop API Tests Complete ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});