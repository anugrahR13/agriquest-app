const axios = require('axios');

// Get the port from the environment or default to 3010
const PORT = process.env.PORT || 3010;
const BASE_URL = `http://localhost:${PORT}`;

async function testAPIEndpoints() {
  try {
    console.log('🧪 Testing AgriQuest API Endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health endpoint response:', healthResponse.data.status);
    
    // Test auth request-otp endpoint
    console.log('\n2. Testing auth request-otp endpoint...');
    const authResponse = await axios.post(`${BASE_URL}/api/auth/request-otp`, {
      phone: '9876543210'
    });
    console.log('✅ Auth request-otp response:', authResponse.data.message);
    
    // Test auth verify-otp endpoint
    console.log('\n3. Testing auth verify-otp endpoint...');
    const verifyResponse = await axios.post(`${BASE_URL}/api/auth/verify-otp`, {
      phone: '9876543210',
      otp: '123456'
    });
    console.log('✅ Auth verify-otp response:', verifyResponse.data.success);
    
    // Test auth profile endpoint (if we have a token)
    if (verifyResponse.data.token) {
      console.log('\n4. Testing auth profile endpoint...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth`, {
        headers: {
          'Authorization': `Bearer ${verifyResponse.data.token}`
        }
      });
      console.log('✅ Auth profile response:', profileResponse.data.user.firstName, profileResponse.data.user.lastName);
    }
    
    // Test missions endpoint
    console.log('\n5. Testing missions endpoint...');
    const missionsResponse = await axios.get(`${BASE_URL}/api/missions`, {
      headers: {
        'Authorization': `Bearer ${verifyResponse.data.token}`
      }
    });
    console.log('✅ Missions endpoint response:', `${missionsResponse.data.missions.length} missions found`);
    
    // Test leaderboard endpoint
    console.log('\n6. Testing leaderboard endpoint...');
    const leaderboardResponse = await axios.get(`${BASE_URL}/api/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${verifyResponse.data.token}`
      }
    });
    console.log('✅ Leaderboard endpoint response:', `${leaderboardResponse.data.leaderboard.length} entries found`);
    
    console.log('\n🎉 All API endpoints are working correctly!');
    console.log(`🔗 Access the application at: ${BASE_URL}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAPIEndpoints();