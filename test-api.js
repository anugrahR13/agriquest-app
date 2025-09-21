const axios = require('axios');

async function testAPI() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3008/api/health');
    console.log('Health endpoint response:', healthResponse.data);
    
    // Test auth request-otp endpoint
    console.log('\nTesting auth request-otp endpoint...');
    const authResponse = await axios.post('http://localhost:3008/api/auth/request-otp', {
      phone: '9876543210'
    });
    console.log('Auth request-otp response:', authResponse.data);
    
    // Test auth verify-otp endpoint
    console.log('\nTesting auth verify-otp endpoint...');
    const verifyResponse = await axios.post('http://localhost:3008/api/auth/verify-otp', {
      phone: '9876543210',
      otp: '123456'
    });
    console.log('Auth verify-otp response:', verifyResponse.data);
    
    // Test auth profile endpoint (if we have a token)
    if (verifyResponse.data.token) {
      console.log('\nTesting auth profile endpoint...');
      const profileResponse = await axios.get('http://localhost:3008/api/auth', {
        headers: {
          'Authorization': `Bearer ${verifyResponse.data.token}`
        }
      });
      console.log('Auth profile response:', profileResponse.data);
    }
    
    // Test missions endpoint
    console.log('\nTesting missions endpoint...');
    const missionsResponse = await axios.get('http://localhost:3008/api/missions', {
      headers: {
        'Authorization': `Bearer ${verifyResponse.data.token}`
      }
    });
    console.log('Missions endpoint response:', missionsResponse.data);
    
    // Test leaderboard endpoint
    console.log('\nTesting leaderboard endpoint...');
    const leaderboardResponse = await axios.get('http://localhost:3008/api/leaderboard', {
      headers: {
        'Authorization': `Bearer ${verifyResponse.data.token}`
      }
    });
    console.log('Leaderboard endpoint response:', leaderboardResponse.data);
    
    console.log('\nAll tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAPI();