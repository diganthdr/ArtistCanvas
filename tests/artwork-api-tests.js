/**
 * Artwork API Tests
 * 
 * This script provides automated tests for the Artwork-related API endpoints.
 * Run this script with Node.js to verify API functionality.
 */

const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const TEST_ARTWORK = {
  title: 'Test Artwork for API Check',
  description: 'This is a test artwork created by the automated test script',
  medium: 'oil',
  size: '16x20 inches',
  price: 499.99,
  year: '2023',
  imageUrl: '/uploads/images/test-artwork.jpg',
  isFeatured: false,
  inStock: true,
  isFramed: false
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
async function testGetAllArtworks() {
  console.log('Testing GET /artworks endpoint...');
  const response = await callAPI('/artworks');
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log('✅ Successfully retrieved artworks list');
    console.log(`   Found ${response.data.length} artworks`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve artworks list');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testCreateArtwork() {
  console.log('Testing POST /artworks endpoint...');
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

async function testGetArtworkById(id) {
  console.log(`Testing GET /artworks/${id} endpoint...`);
  const response = await callAPI(`/artworks/${id}`);
  
  if (response.status === 200 && response.data.id === id) {
    console.log('✅ Successfully retrieved artwork by ID');
    return response.data;
  } else {
    console.log('❌ Failed to retrieve artwork by ID');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testUpdateArtwork(id) {
  console.log(`Testing PATCH /artworks/${id} endpoint...`);
  const updatedTitle = `${TEST_ARTWORK.title} (Updated)`;
  const updatedPrice = TEST_ARTWORK.price + 50;
  
  const response = await callAPI(`/artworks/${id}`, 'PATCH', {
    title: updatedTitle,
    price: updatedPrice
  });
  
  if (response.status === 200 && response.data.title === updatedTitle) {
    console.log('✅ Successfully updated artwork');
    return response.data;
  } else {
    console.log('❌ Failed to update artwork');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return null;
  }
}

async function testDeleteArtwork(id) {
  console.log(`Testing DELETE /artworks/${id} endpoint...`);
  const response = await callAPI(`/artworks/${id}`, 'DELETE');
  
  if (response.status === 200) {
    console.log('✅ Successfully deleted artwork');
    return true;
  } else {
    console.log('❌ Failed to delete artwork');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return false;
  }
}

async function testGetFeaturedArtworks() {
  console.log('Testing GET /artworks/featured endpoint...');
  const response = await callAPI('/artworks/featured');
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log('✅ Successfully retrieved featured artworks');
    console.log(`   Found ${response.data.length} featured artworks`);
    return response.data;
  } else {
    console.log('❌ Failed to retrieve featured artworks');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

async function testGetArtworksByMedium(medium) {
  console.log(`Testing GET /artworks/medium/${medium} endpoint...`);
  const response = await callAPI(`/artworks/medium/${medium}`);
  
  if (response.status === 200 && Array.isArray(response.data)) {
    console.log(`✅ Successfully retrieved artworks with medium '${medium}'`);
    console.log(`   Found ${response.data.length} artworks`);
    return response.data;
  } else {
    console.log(`❌ Failed to retrieve artworks with medium '${medium}'`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    return [];
  }
}

// Main test execution
async function runTests() {
  console.log('=== Starting Artwork API Tests ===\n');
  
  // Test retrieving all artworks
  const allArtworks = await testGetAllArtworks();
  console.log();
  
  // Test retrieving featured artworks
  const featuredArtworks = await testGetFeaturedArtworks();
  console.log();
  
  // Test retrieving artworks by medium
  const oilArtworks = await testGetArtworksByMedium('oil');
  console.log();
  
  // Test creating a new artwork
  const createdArtwork = await testCreateArtwork();
  console.log();
  
  if (createdArtwork) {
    // Test getting artwork by ID
    const retrievedArtwork = await testGetArtworkById(createdArtwork.id);
    console.log();
    
    if (retrievedArtwork) {
      // Test updating artwork
      const updatedArtwork = await testUpdateArtwork(createdArtwork.id);
      console.log();
      
      // Test deleting artwork
      await testDeleteArtwork(createdArtwork.id);
      console.log();
    }
  }
  
  console.log('=== Artwork API Tests Complete ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});