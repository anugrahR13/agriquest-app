/**
 * Direct test of Google Vision API to check if it's properly configured
 */

async function testGoogleVisionDirect() {
  console.log('Testing Google Vision API directly...\n');
  
  try {
    // Set environment variables
    process.env.GOOGLE_VISION_ENABLED = 'true';
    
    // Import the Google Vision client directly
    const vision = require('@google-cloud/vision');
    
    // Initialize the client with explicit credentials
    const client = new vision.ImageAnnotatorClient({
      keyFilename: './config/service-account-key.json',
    });
    
    console.log('✅ Google Vision client created successfully');
    
    // Test with a simple image
    const testImageUrl = 'https://images.unsplash.com/photo-1525302223413-13b1724934be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80';
    
    console.log('Analyzing image with Google Vision API...');
    const [result] = await client.labelDetection(testImageUrl);
    const labels = result.labelAnnotations;
    
    console.log('Labels found:');
    labels.forEach(label => {
      console.log(`- ${label.description} (${(label.score * 100).toFixed(1)}%)`);
    });
    
    console.log('\n✅ Google Vision API is working correctly!');
  } catch (error) {
    console.error('❌ Google Vision API test failed:', error.message);
    
    // Check if it's a credentials issue
    if (error.message.includes('Could not load the default credentials') || 
        error.message.includes('keyFilename') || 
        error.message.includes('credentials')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Verify the service account key file is in the correct location');
      console.log('2. Check that the Google Vision API is enabled in your Google Cloud project');
      console.log('3. Ensure billing is enabled for your Google Cloud project');
      console.log('4. Verify the service account has the necessary permissions');
    }
  }
}

// Run the test
testGoogleVisionDirect();