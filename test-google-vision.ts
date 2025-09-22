/**
 * Test script to verify Google Vision API functionality
 */

// @ts-ignore
import { analyzePlantHealth } from './server/utils/aiAnalysis.ts';

async function testGoogleVision() {
  console.log('Testing Google Vision API...');
  
  // Test with a sample plant image URL
  const testImageUrl = 'https://images.unsplash.com/photo-1525302223413-13b1724934be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80';
  
  try {
    // Enable Google Vision for this test
    process.env.GOOGLE_VISION_ENABLED = 'true';
    
    console.log('Analyzing image with Google Vision API...');
    const result = await analyzePlantHealth(testImageUrl);
    
    console.log('Analysis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n✓ Google Vision API test completed successfully!');
  } catch (error) {
    console.error('✗ Google Vision API test failed:', error);
    
    // Test with TensorFlow.js as fallback
    console.log('\nTesting with TensorFlow.js as fallback...');
    process.env.GOOGLE_VISION_ENABLED = 'false';
    
    try {
      const result = await analyzePlantHealth(testImageUrl);
      console.log('Fallback Analysis Result:');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n✓ TensorFlow.js fallback test completed successfully!');
    } catch (fallbackError) {
      console.error('✗ TensorFlow.js fallback test also failed:', fallbackError);
    }
  }
}

// Run the test
testGoogleVision();