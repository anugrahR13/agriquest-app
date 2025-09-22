/**
 * Test script to verify Google Vision API integration
 * This script tests if the Google Vision API is properly configured and working
 */

// @ts-ignore
const { analyzePlantHealth } = require('./server/utils/aiAnalysis.ts');

async function testGoogleVisionIntegration() {
  console.log('Testing Google Vision API Integration...\n');
  
  // Sample image URL for testing
  const sampleImageUrl = 'https://images.unsplash.com/photo-1525302223413-13b1724934be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80';
  
  try {
    // Enable Google Vision for this test
    process.env.GOOGLE_VISION_ENABLED = 'true';
    
    console.log('Analyzing image with Google Vision API...');
    const result = await analyzePlantHealth(sampleImageUrl);
    
    console.log('Analysis Result:');
    console.log('================');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n✅ Google Vision API integration test completed successfully!');
    console.log(`Health Score: ${result.healthScore}/100`);
    console.log(`Disease Detected: ${result.diseaseDetected ? 'Yes' : 'No'}`);
    console.log(`Recommendations: ${result.recommendations.length} found`);
  } catch (error) {
    console.error('❌ Google Vision API integration test failed:', error.message);
    
    // Test with TensorFlow.js as fallback
    console.log('\nTesting with TensorFlow.js as fallback...');
    process.env.GOOGLE_VISION_ENABLED = 'false';
    
    try {
      const result = await analyzePlantHealth(sampleImageUrl);
      console.log('Fallback Analysis Result:');
      console.log('========================');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n✅ TensorFlow.js fallback test completed successfully!');
    } catch (fallbackError) {
      console.error('❌ TensorFlow.js fallback test also failed:', fallbackError.message);
    }
  }
}

// Run the test
testGoogleVisionIntegration();