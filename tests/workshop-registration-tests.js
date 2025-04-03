/**
 * Workshop Registration Tests
 * 
 * This script provides automated tests for the workshop registration functionality.
 * Run this script with Node.js to verify registration API functionality.
 */

async function callAPI(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const options = { method, headers };
  
  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  const data = await response.json();
  return { status: response.status, data };
}

async function testGetAllWorkshops() {
  console.log('\n🔍 Testing GET /api/workshops...');
  const { status, data } = await callAPI('/api/workshops');
  
  console.log(`Status: ${status}`);
  console.log(`Retrieved ${data.length} workshops`);
  
  if (status === 200 && Array.isArray(data) && data.length > 0) {
    console.log('✅ Successfully retrieved workshops');
    return data[0].id; // Return the first workshop ID for further tests
  } else {
    console.log('❌ Failed to retrieve workshops');
    throw new Error('Workshop retrieval test failed');
  }
}

async function testRegisterForWorkshop(workshopId) {
  console.log(`\n🔍 Testing POST /api/registrations for workshop ID ${workshopId}...`);
  
  const registrationData = {
    workshopId,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "123-456-7890",
    experienceLevel: "beginner"
  };
  
  const { status, data } = await callAPI('/api/registrations', 'POST', registrationData);
  
  console.log(`Status: ${status}`);
  console.log('Registration data:', data);
  
  if (status === 201 && data.id) {
    console.log('✅ Successfully registered for workshop');
    return data.id; // Return registration ID
  } else {
    console.log('❌ Failed to register for workshop');
    throw new Error('Workshop registration test failed');
  }
}

async function testGetRegistrationsForWorkshop(workshopId) {
  console.log(`\n🔍 Testing GET /api/workshops/${workshopId}/registrations...`);
  
  const { status, data } = await callAPI(`/api/workshops/${workshopId}/registrations`);
  
  console.log(`Status: ${status}`);
  console.log(`Retrieved ${data ? data.length : 'undefined'} registrations for workshop ID ${workshopId}`);
  
  if (status === 401) {
    // This is expected since we made the route admin-only
    console.log('✅ Admin-only access control working correctly');
    return true;
  } else if (status === 200 && Array.isArray(data)) {
    console.log('✅ Successfully retrieved registrations');
    return true;
  } else {
    console.log('❌ Failed to retrieve registrations');
    throw new Error('Workshop registrations retrieval test failed');
  }
}

async function testInvalidRegistration(workshopId) {
  console.log(`\n🔍 Testing invalid registration for workshop ID ${workshopId}...`);
  
  // Missing required fields
  const invalidData = {
    workshopId,
    firstName: "Test" // Missing other required fields
  };
  
  const { status, data } = await callAPI('/api/registrations', 'POST', invalidData);
  
  console.log(`Status: ${status}`);
  console.log('Error response:', data);
  
  if (status === 400) {
    console.log('✅ Server correctly rejected invalid registration');
    return true;
  } else {
    console.log('❌ Server failed to validate registration data');
    throw new Error('Invalid registration validation test failed');
  }
}

async function testWorkshopDetailsById(workshopId) {
  console.log(`\n🔍 Testing GET /api/workshops/${workshopId}...`);
  
  const { status, data } = await callAPI(`/api/workshops/${workshopId}`);
  
  console.log(`Status: ${status}`);
  console.log('Workshop details:', data.title);
  
  if (status === 200 && data.id === workshopId) {
    console.log('✅ Successfully retrieved workshop details');
    return true;
  } else {
    console.log('❌ Failed to retrieve workshop details');
    throw new Error('Workshop details retrieval test failed');
  }
}

async function testFilterWorkshopsByType() {
  console.log('\n🔍 Testing GET /api/workshops/type/online...');
  
  const { status, data } = await callAPI('/api/workshops/type/online');
  
  console.log(`Status: ${status}`);
  console.log(`Retrieved ${data.length} online workshops`);
  
  if (status === 200 && Array.isArray(data)) {
    const allOnline = data.every(workshop => workshop.type === 'online');
    if (allOnline) {
      console.log('✅ Successfully filtered workshops by type');
      return true;
    } else {
      console.log('❌ Filter returned wrong workshop types');
      throw new Error('Workshop type filtering test failed');
    }
  } else {
    console.log('❌ Failed to filter workshops by type');
    throw new Error('Workshop type filtering test failed');
  }
}

async function runTests() {
  try {
    console.log('🧪 Starting Workshop Registration Tests 🧪\n');
    
    // Get workshops and select the first one for testing
    const workshopId = await testGetAllWorkshops();
    
    // Test workshop details
    await testWorkshopDetailsById(workshopId);
    
    // Test workshop filtering
    await testFilterWorkshopsByType();
    
    // Test workshop registration
    const registrationId = await testRegisterForWorkshop(workshopId);
    
    // Test getting registrations for a workshop
    await testGetRegistrationsForWorkshop(workshopId);
    
    // Test invalid registration validation
    await testInvalidRegistration(workshopId);
    
    console.log('\n✨ All workshop registration tests passed! ✨');
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
  }
}

// Run tests when script is executed directly
if (require.main === module) {
  runTests();
}

// Export functions for use in other test scripts
module.exports = {
  testGetAllWorkshops,
  testRegisterForWorkshop,
  testGetRegistrationsForWorkshop,
  testWorkshopDetailsById,
  testFilterWorkshopsByType,
  testInvalidRegistration,
  runTests
};