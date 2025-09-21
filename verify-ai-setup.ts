/**
 * Verification script to confirm both TensorFlow.js and Google Vision API are properly installed and configured
 */

console.log('Verifying AI setup...');

// Check TensorFlow.js
try {
  console.log('1. Checking TensorFlow.js installation...');
  const tf = require('@tensorflow/tfjs');
  console.log('   ✓ TensorFlow.js version:', tf.version.tfjs);
  console.log('   ✓ TensorFlow.js successfully imported');
} catch (error: any) {
  console.error('   ✗ TensorFlow.js import failed:', error.message);
}

// Check TensorFlow models
try {
  console.log('2. Checking TensorFlow models installation...');
  // @ts-ignore
  const mobilenet = require('@tensorflow-models/mobilenet');
  // @ts-ignore
  const cocoSsd = require('@tensorflow-models/coco-ssd');
  console.log('   ✓ MobileNet model successfully imported');
  console.log('   ✓ COCO-SSD model successfully imported');
} catch (error: any) {
  console.error('   ✗ TensorFlow models import failed:', error.message);
}

// Check Google Vision API
try {
  console.log('3. Checking Google Vision API installation...');
  const vision = require('@google-cloud/vision');
  console.log('   ✓ Google Vision API successfully imported');
  
  // Check if we can create a client (this will fail without credentials, but that's expected)
  try {
    const client = new vision.ImageAnnotatorClient();
    console.log('   ✓ Google Vision client created successfully');
  } catch (clientError: any) {
    console.log('   ⚠ Google Vision client creation failed (expected without credentials):', clientError.message);
  }
} catch (error: any) {
  console.error('   ✗ Google Vision API import failed:', error.message);
}

console.log('\nVerification complete!');
console.log('\nTo use Google Vision API, you need to:');
console.log('1. Set GOOGLE_VISION_ENABLED=true in your .env file');
console.log('2. Create a Google Cloud service account and download the JSON key');
console.log('3. Set GOOGLE_APPLICATION_CREDENTIALS to point to your JSON key file');
console.log('4. Enable the Vision API in your Google Cloud Console');