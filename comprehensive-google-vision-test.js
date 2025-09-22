/**
 * Comprehensive test of Google Vision API to check if it's properly configured
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function testGoogleVisionComprehensive() {
  console.log('Comprehensive Google Vision API test...\n');
  
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
    
    // Download a test image
    const testImageUrl = 'https://images.unsplash.com/photo-1525302223413-13b1724934be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80';
    const imagePath = './test-image.jpg';
    
    console.log('Downloading test image...');
    await downloadImage(testImageUrl, imagePath);
    console.log('✅ Image downloaded successfully');
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Test label detection
    console.log('Analyzing image with Google Vision API...');
    const [labelResult] = await client.labelDetection(imageBuffer);
    const labels = labelResult.labelAnnotations || [];
    
    console.log(`\nLabels found (${labels.length}):`);
    if (labels.length > 0) {
      labels.slice(0, 10).forEach((label, index) => {
        console.log(`${index + 1}. ${label.description} (${(label.score * 100).toFixed(1)}%)`);
      });
    } else {
      console.log('No labels found');
    }
    
    // Test object localization
    console.log('\nTesting object localization...');
    const [objectResult] = await client.objectLocalization(imageBuffer);
    const objects = objectResult.localizedObjectAnnotations || [];
    
    console.log(`\nObjects found (${objects.length}):`);
    if (objects.length > 0) {
      objects.slice(0, 10).forEach((object, index) => {
        console.log(`${index + 1}. ${object.name} (${(object.score * 100).toFixed(1)}%)`);
      });
    } else {
      console.log('No objects found');
    }
    
    // Clean up
    fs.unlinkSync(imagePath);
    
    if (labels.length > 0 || objects.length > 0) {
      console.log('\n✅ Google Vision API is working correctly!');
    } else {
      console.log('\n⚠️  Google Vision API is working but not returning expected results');
    }
  } catch (error) {
    console.error('❌ Google Vision API test failed:', error.message);
    
    // Clean up if needed
    if (fs.existsSync('./test-image.jpg')) {
      fs.unlinkSync('./test-image.jpg');
    }
    
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
testGoogleVisionComprehensive();