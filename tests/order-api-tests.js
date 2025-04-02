/**
 * Order and E-commerce API Tests
 * 
 * This script provides automated tests for the order-related API endpoints.
 * Run this script with Node.js to verify API functionality.
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_ORDER = {
  email: 'customer@example.com',
  total: 749.98,
  status: 'pending',
};

const TEST_ARTWORK = {
  title: 'Test Artwork for Order Test',
  description: 'This is a test artwork created for order testing',
  medium: 'acrylic',
  size: '16x20 inches',
  price: 349.99,
  year: '2023',
  imageUrl: '/uploads/images/test-order-artwork.jpg',
  isFeatured: false,
  inStock: true,
  isFramed: true,
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
async function testCreateTestArtwork() {
  console.log('Creating test artwork for order tests...');
  const response = await callAPI('/artworks', 'POST', TEST_ARTWORK);
  
  if (response.status === 201 && response.data.id) {
    console.log('✅ Successfully created test artwork');
    console.log(`   Created artwork with ID: ${response.data.id}`);
    return response.data;
  } else {
    console.log('❌ Failed to create test artwork');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testCreateOrder(artworkId) {
  console.log('Testing POST /orders endpoint...');
  
  // Create order with order items
  const orderData = {
    ...TEST_ORDER,
    items: [
      {
        artworkId,
        quantity: 1,
        price: TEST_ARTWORK.price
      },
      {
        artworkId,
        quantity: 1,
        price: TEST_ARTWORK.price
      }
    ]
  };
  
  const response = await callAPI('/orders', 'POST', orderData);
  
  if (response.status === 201 && response.data.id) {
    console.log('✅ Successfully created test order');
    console.log(`   Created order with ID: ${response.data.id}`);
    return response.data;
  } else {
    console.log('❌ Failed to create test order');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testGetOrderById(id) {
  console.log(`Testing GET /orders/${id} endpoint...`);
  const response = await callAPI(`/orders/${id}`);
  
  if (response.status === 200 && response.data.order.id === id) {
    console.log('✅ Successfully retrieved order by ID');
    console.log(`   Order has ${response.data.items.length} items`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve order by ID');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testUpdateOrderStatus(id) {
  console.log(`Testing PATCH /orders/${id}/status endpoint...`);
  const statusUpdate = {
    status: 'completed'
  };
  
  const response = await callAPI(`/orders/${id}/status`, 'PATCH', statusUpdate);
  
  if (response.status === 200 && response.data.status === 'completed') {
    console.log('✅ Successfully updated order status');
    return response.data;
  } else {
    console.log('❌ Failed to update order status');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testGetAllOrders() {
  console.log('Testing GET /orders endpoint...');
  const response = await callAPI('/orders');
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log('✅ Successfully retrieved orders list');
    console.log(`   Found ${response.data.length} orders`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve orders list');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testCleanup(artworkId) {
  console.log('Cleaning up test data...');
  
  // Delete the test artwork
  const response = await callAPI(`/artworks/${artworkId}`, 'DELETE');
  
  if (response.status === 200) {
    console.log('✅ Successfully cleaned up test artwork');
    return true;
  } else {
    console.log('❌ Failed to clean up test artwork');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('=== Starting Order API Tests ===\n');
  
  // Create test artwork first
  const testArtwork = await testCreateTestArtwork();
  console.log();
  
  if (testArtwork) {
    // Test creating a new order
    const createdOrder = await testCreateOrder(testArtwork.id);
    console.log();
    
    if (createdOrder) {
      // Test getting order by ID
      const retrievedOrder = await testGetOrderById(createdOrder.id);
      console.log();
      
      if (retrievedOrder) {
        // Test updating order status
        const updatedOrder = await testUpdateOrderStatus(createdOrder.id);
        console.log();
      }
    }
    
    // Test getting all orders
    const allOrders = await testGetAllOrders();
    console.log();
    
    // Clean up test data
    await testCleanup(testArtwork.id);
    console.log();
  }
  
  console.log('=== Order API Tests Complete ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});