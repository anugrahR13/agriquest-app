/**
 * Test script to verify the crop analysis API endpoint
 * This script tests the /api/crop-analysis endpoint with Google Vision integration
 */

const http = require('http');

// Demo function to test the crop analysis API
async function testCropAnalysisAPI() {
  console.log('Testing Crop Analysis API with Google Vision...\n');
  
  // Sample image URL for testing
  const sampleImageUrl = 'https://images.unsplash.com/photo-1525302223413-13b1724934be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80';
  
  // Prepare the request data
  const postData = JSON.stringify({
    imageUrl: sampleImageUrl
  });
  
  // API endpoint configuration (assuming the server is running on port 3001)
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/crop-analysis',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      // For demo purposes, we'll use a mock JWT token
      'Authorization': 'Bearer mock_jwt_user_demo_12345_' + Date.now()
    }
  };
  
  // Make the request
  const req = http.request(options, (res) => {
    let data = '';
    
    // Collect the response data
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // Handle the complete response
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Crop Analysis API Response:');
        console.log('==========================');
        console.log(JSON.stringify(result, null, 2));
        
        if (result.analysis) {
          console.log('\n✅ Crop analysis API test completed successfully!');
          console.log(`Health Score: ${result.analysis.healthScore}/100`);
          console.log(`Disease Detected: ${result.analysis.diseaseDetected ? 'Yes' : 'No'}`);
          console.log(`Recommendations: ${result.analysis.recommendations.length} found`);
        } else {
          console.log('\n❌ Crop analysis API test failed:');
          console.log(result.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
        console.log('Raw response:', data);
      }
    });
  });
  
  // Handle request errors
  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\nNote: This is expected if the development server is not running.');
    console.log('To test this properly:');
    console.log('1. Start the development server with "npm run dev"');
    console.log('2. Run this script again');
  });
  
  // Send the request data
  req.write(postData);
  req.end();
}

// Run the test
console.log('Crop Analysis API Test with Google Vision');
console.log('========================================\n');
testCropAnalysisAPI();